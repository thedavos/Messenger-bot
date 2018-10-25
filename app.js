'use strict';

const express = require('express');
const bodyParser = require('body-parser');
const request = require('request');
const access_token = "EAAHJPMnCG2kBAMlfRcaIsFLeTxvw1TuZCQ75rZB70oO0X0C0EbiHSAMq752fZC1W8akZCQyBy5eELNOnDESfaG63gAqmZBgDPoparm6hLgE0jnlAsM7joIOPEXZC1aXQjCllf8WYLYuDSGCzBn9M71UBMZB48Swj0agaA0Rfqm84BI63oCZBeZB8ZA"

const app = express();

app.set('port', 5000);
app.use(bodyParser.json());

app.get('/', function (req, response) {
    response.send('Hola Mundo!');
})

app.get('/webhook', function (req, response) {
    if (req.query['hub.verify_token'] === 'sweetpizza_token') {
        response.send(req.query['hub.challenge']);
    } else {
        response.send('Sweet Pizza no tienes permisos.');
    }
});

app.post('/webhook/', function (req, res) {
    const webhook_event = req.body.entry[0];
    if (webhook_event.messaging) {
        webhook_event.messaging.forEach(event => {
            handleEvent(event.sender.id, event);
        });
    }
    res.sendStatus(200);
});

function handleEvent(senderId, event) {
    if (event.message) {
        handleMessage(senderId, event.message)
    } else if (event.postback) {
        handlePostback(senderId, event.postback.payload)
    }
}

function handleMessage(senderId, event) {
    if (event.text) {
        /* defaultMessage(senderId); */
        /* sendImage(senderId) */
        /* contactSupport(senderId) */
        /* showLocation(senderId) */
        /* receipt(senderId) */
        getLocation(senderId)
    } else if (event.attachments) {
        handleAttachments(senderId, event)
    }
}

function handlePostback(senderId, payload) {
    switch (payload) {
        case "GET_STARTED_SWEETPIZZA":
            console.log(payload)
            break;
        case "PIZZAS_PAYLOAD":
            showPizzas(senderId)
            console.log(payload)
            break;
        case "PEPPERONI_PAYLOAD":
            sizePizza(senderId)
            break;
        default:
            console.log(payload)
            break;
    }
}

function handleAttachments(senderId, event) {
    let attachment_type = event.attachments[0].type
    switch (attachment_type) {
        case 'imagen':
            console.log(attachment_type)
            break;
        case 'video':
            console.log(attachment_type)
            break;
        case 'audio':
            console.log(attachment_type)
            break;
        case 'file':
            console.log(attachment_type)
            break;
        case 'location':
            console.log(JSON.stringify(event))
        default:
            break;
    }
}

function defaultMessage(senderId) {
    const messageData = {
        "recipient": {
            "id": senderId
        },
        "message": {
            "text": "Hola soy un bot de messenger y te invito a utilizar nuestro menú",
            "quick_replies": [
                {
                    "content_type": "text",
                    "title": "¿Quieres una Pizza?",
                    "payload": "PIZZAS_PAYLOAD"
                },
                {
                    "content_type": "text",
                    "title": "Acerca de",
                    "payload": "ABOUT_PAYLOAD"
                }
            ]
        }
    }
    sendActions(senderId, "mark_seen")
    sendActions(senderId, "typing_on")
    callSendApi(messageData);
}

function sendActions(senderId, action) {
    const messageData = {
        "recipient": {
            "id": senderId
        },
        "sender_action": action
    }
    callSendApi(messageData)
}

function callSendApi(response) {
    request({
        "uri": "https://graph.facebook.com/me/messages",
        "qs": {
            "access_token": access_token
        },
        "method": "POST",
        "json": response
    },
    function (err) {
        if (err) {
            console.log('Ha ocurrido un error')
        } else {
            console.log('Mensaje enviado')
        }
    })
}

function showPizzas(senderId) {
    const messageData = {
        "recipient": {
            "id": senderId
        },
        "message": {
            "attachment": {
                "type": "template",
                "payload": {
                    "template_type": "generic",
                    "elements": [
                        {
                            "title": "Peperoni",
                            "subtitle": "Con todo el sabor del peperoni",
                            "image_url": "https://s3.amazonaws.com/chewiekie/img/productos-pizza-peperoni-champinones.jpg",
                            "buttons": [
                                {
                                    "type": "postback",
                                    "title": "Elegir Pepperoni",
                                    "payload": "PEPPERONI_PAYLOAD",
                                }
                            ]
                        },
                        {
                            "title": "Pollo BBQ",
                            "subtitle": "Con todo el sabor del BBQ",
                            "image_url": "https://s3.amazonaws.com/chewiekie/img/productos-pizza-peperoni-champinones.jpg",
                            "buttons": [
                                {
                                    "type": "postback",
                                    "title": "Elegir Pollo BBQ",
                                    "payload": "BBQ_PAYLOAD",
                                }
                            ]
                        }
                    ]
                }
            }
        }
    }
    callSendApi(messageData)
}

function sizePizza(senderId) {
    const messageData = {
        "recipient": {
            "id": senderId
        },
        "message": {
            "attachment": {
                "type": "template",
                "payload": {
                    "template_type": "list",
                    "top_element_style": "large",
                    "elements": [
                        {
                            "title": "Individual",
                            "image_url": "https://s3.amazonaws.com/chewiekie/img/productos-pizza-peperoni-champinones.jpg",
                            "subtitle": "Porcion individual de pizza",
                            "buttons": [
                                {
                                    "type": "postback",
                                    "title": "Elegir Individual",
                                    "payload": "PERSONAL_SIZE_PAYLOAD",
                                }
                            ]
                        },
                        {
                            "title": "Mediana",
                            "image_url": "https://s3.amazonaws.com/chewiekie/img/productos-pizza-peperoni-champinones.jpg",
                            "subtitle": "Porcion Mediana de pizza",
                            "buttons": [
                                {
                                    "type": "postback",
                                    "title": "Elegir Mediana",
                                    "payload": "MEDIUM_SIZE_PAYLOAD",
                                }
                            ]
                        }
                    ]
                }
            }
        }
    }
    callSendApi(messageData);
}

function sendImage(senderId) {
    const messageData = {
        "recipient": {
            "id": senderId
        },
        "message": {
            "attachment": {
                "type": "image",
                "payload": {
                    "url": "https://media.giphy.com/media/1dOIvm5ynwYolB2Xlh/giphy.gif",
                }
            }
        }
    }

    callSendApi(messageData)
}

function contactSupport(senderId) {
    const messageData = {
        "recipient": {
            "id": senderId
        },
        "message": {
            "attachment": {
                "type": "template",
                "payload": {
                    "template_type": "button",
                    "text": "Hola, este es el canal de soporte, quieres llamarnos?",
                    "buttons": [
                        {
                            "type": "phone_number",
                            "title": "Llamar a un asesor",
                            "payload": "+56944966002"
                        }
                    ]
                }
            }
        }
    }

    callSendApi(messageData)
}

function showLocation(senderId) {
    const messageData = {
        "recipient": {
            "id": senderId
        },
        "message": {
            "attachment": {
                "type": "template",
                "payload": {
                    "template_type": "list",
                    "top_element_style": "large",
                    "elements": [
                        {
                            "title": "Sucursal Mexico",
                            "image_url": "https://s3.amazonaws.com/chewiekie/img/productos-pizza-peperoni-champinones.jpg",
                            "subtitle": "Direccion bonita #555",
                            "buttons": [
                                {
                                    "title": "Ver en el mapa",
                                    "type": "web_url",
                                    "url": "https://goo.gl/maps/GCCpWmZep1t",
                                    "webview_height_ratio": "full"
                                }
                            ]
                        },
                        {
                            "title": "Sucursal Colombia",
                            "image_url": "https://s3.amazonaws.com/chewiekie/img/productos-pizza-peperoni-champinones.jpg",
                            "subtitle": "Direccion muy lejana #333",
                            "buttons": [
                                {
                                    "title": "Ver en el mapa",
                                    "type": "web_url",
                                    "url": "https://goo.gl/maps/GCCpWmZep1t",
                                    "webview_height_ratio": "tall"
                                }
                            ]
                        }
                    ]
                }
            }
        }
    }
    callSendApi(messageData);
}

function receipt(senderId) {
    const messageData = {
        "recipient": {
            "id": senderId
        },
        "message": {
            "attachment": {
                "type": "template",
                "payload": {
                    "template_type": "receipt",
                    "recipient_name": "Rodrigo Álvarez",
                    "order_number": "123123",
                    "currency": "MXN",
                    "payment_method": "Efectivo",
                    "order_url": "https://platzi.com/order/123",
                    "timestamp": "123123123",
                    "address": {
                        "street_1": "Platzi HQ",
                        "street_2": "---",
                        "city": "México City",
                        "postal_code": "545454",
                        "state": "México",
                        "country": "México"
                    },
                    "summary": {
                        "subtotal": 12.00,
                        "shipping_cost": 2.00,
                        "total_tax": 1.00,
                        "total_cost": 15.00
                    },
                    "adjustments": [
                        {
                            "name": "Descuento frecuente",
                            "amount": 1.00
                        }
                    ],
                    "elements": [
                        {
                            "title": "Pizza Pepperoni",
                            "subtitle": "La mejor pizza de pepperoni",
                            "quantity": 1,
                            "price": 10,
                            "currency": "MXN",
                            "image_url": "https://s3.amazonaws.com/chewiekie/img/productos-pizza-peperoni-champinones.jpg"
                        },
                        {
                            "title": "Bebida",
                            "subtitle": "Jugo de Tamarindo",
                            "quantity": 1,
                            "price": 2,
                            "currency": "MXN",
                            "image_url": "https://s3.amazonaws.com/chewiekie/img/productos-pizza-peperoni-champinones.jpg"
                        },
                    ]
                }
            }
        }
    }

    callSendApi(messageData)
}

function getLocation(senderId) {
    const messageData = {
        "recipient": {
            "id": senderId
        },
        "message": {
            "text": "Ahora ¿Puedes proporcionarnos tu ubicación?",
            "quick_replies": [
                {
                    "content_type": "location"
                }
            ]
        }
    }

    callSendApi(messageData)
}

app.listen(app.get('port'), function () {
    console.log('Nuestro servidor esta funcionando en el puerto: ', app.get('port'));
});
