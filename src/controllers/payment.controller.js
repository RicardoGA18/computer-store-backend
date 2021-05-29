import Purchase from '../models/Purchase'
import Product from '../models/Product'
import mercadopago from 'mercadopago'

export const createPreference = async (req,res) => {
  try {
    /* Creating the preference */
    const {user , cart} = req.body
    const payer = {
      name: user.name,
      surname: user.lastName,
      email: user.email,
      phone: {
        number: user.phone,
        area_code: '51',
      },
      address: {
        zip_code: user.zipCode,
        street_name: user.address,
        street_number: user.addressNumber,
      },
      identification: {
        type: 'DNI',
        number: user.dni
      }
    }
    const payment_methods = {
      installments: 6,
      excluded_payment_types: [
        {
          id: 'atm'
        }
      ],
      excluded_payment_methods: [
        {
          id: 'diners'
        }
      ]
    }
    const preference = {
      items: [],
      back_urls: {
        success: `${process.env.FRONTEND}/pasarela-de-pago/success`,
        pending: `${process.env.FRONTEND}/pasarela-de-pago/success`,
        failure: `${process.env.FRONTEND}/pasarela-de-pago/failure`,
      },
      payment_methods,
      payer,
      auto_return: 'approved',
      notification_url: '',
      external_reference: user._id
    }
    if(process.env.NODE_ENV === 'production'){
      preference.notification_url = `${req.get("host")}/api/payments/notifications`
    }
    for(let item of cart){
      preference.items.push({
        id: item._id,
        title: item.name,
        description: 'Producto de computer Store',
        picture_url: item.img,
        quantity: item.amount,
        currency_id: 'PEN',
        unit_price: ( item.price * (100 - item.discount) )/ 100,
        category_id: item.categoryId
      })
    }
    const response = await mercadopago.preferences.create(preference)
    return res.status(200).json({
      success: true,
      content: {
        url: response.body.init_point
      },
      message: 'Preferencia creada correctamente'
    })
  } catch (error) {
    console.log(error)
    return res.status(500).json({
      success: false,
      content: error.toString(),
      message: error.message
    })
  }
}

export const getNotifications = async (req,res) => {
  try {
    res.sendStatus(200)
    const { action } = req.body
    if(action !== 'payment.created'){
      return
    }
    const { id } = req.body.data
    const matchPurchase = await Purchase.findOne({mercadoPagoId: id})
    if(matchPurchase){
      return
    }
    const preferenceInfo = await mercadopago.payment.get(id)
    const { body:infoMP } = preferenceInfo
    const newPurchase = {
      userId: infoMP.external_reference,
      totalAmount: infoMP.transaction_amount,
      mercadoPagoId: infoMP.id,
      products: []
    }
    for(let product of infoMP.additional_info.items){
      const newProduct = {
        _id: product.id,
        name: product.title,
        img: product.picture_url,
        price: product.unit_price,
        amount: product.quantity,
      }
      newPurchase.products.push(newProduct)
    }
    for(let prod of newPurchase.products){
      const oldProdObject = await Product.findById(prod._id)
      const oldProduct = oldProdObject.toJSON()
      const newStock = oldProduct.stock - prod.amount
      oldProdObject.stock = newStock
      await oldProdObject.save()
    }
    await Purchase.create(newPurchase)
  } catch (error) {
    console.log(error)
  }
}

export const getPurchasesByUserId = async (req,res) => {
  try {
    const { clientId } = req.params
    const purchasesObject = await Purchase.find({userId: clientId})
    const purchases = purchasesObject.map(p => p.toJSON())
    return res.status(200).json({
      success: true,
      content: purchases,
      message: 'Compras obtenidas correctamente'
    })
  } catch (error) {
    console.log(error)
    if(error.path === '_id'){
      return res.status(400).json({
        success: false,
        content: error.toString(),
        message: "Id inválido"
      })
    }
    return res.status(500).json({
      success: false,
      content: error.toString(),
      message: error.message
    })
  }
}

export const getAllPurchases = async (req,res) => {
  try {
    const purchasesObject = await Purchase.find({})
    const purchases = purchasesObject.map(obj => obj.toJSON())
    return res.status(200).json({
      success: true,
      content: purchases,
      message: 'Ventas obtenidas correctamente'
    })
  } catch (error) {
    console.log(error)
    return res.status(500).json({
      success: false,
      content: error.toString(),
      message: error.message
    })
  }
}

export const getPurchaseById = async (req,res) => {
  try {
    const { purchaseId } = req.params
    const purchaseObject = await Purchase.findById(purchaseId)
    const purchase = purchaseObject.toJSON()
    return res.status(200).json({
      success: true,
      content: purchase,
      message: 'Venta obtenida correctamente'
    })
  } catch (error) {
    console.log(error)
    if(error.path === '_id'){
      return res.status(400).json({
        success: false,
        content: error.toString(),
        message: "Id inválido"
      })
    }
    return res.status(500).json({
      success: false,
      content: error.toString(),
      message: error.message
    })
  }
}