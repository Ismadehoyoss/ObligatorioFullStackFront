import Joi from "joi";

const coordenadasSchema = Joi.object({
    latitude: Joi.number().min(-90).max(90).required().messages({
        "number.base": "La latitud debe ser un número",
        "number.min": "La latitud debe ser mayor o igual a -90",
        "number.max": "La latitud debe ser menor o igual a 90",
        "any.required": "La latitud es un campo obligatorio"
    }),
    longitude: Joi.number().min(-180).max(180).required().messages({
        "number.base": "La longitud debe ser un número",
        "number.min": "La longitud debe ser mayor o igual a -180",
        "number.max": "La longitud debe ser menor o igual a 180",
        "any.required": "La longitud es un campo obligatorio"
    })
});

export default coordenadasSchema;
