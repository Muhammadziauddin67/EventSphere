import yup from "yup"

export const userSchema = yup.object({
    username: yup
        .string()
        .trim()
        .min(3, 'Username must be atleast 3 characters long')
        .required(),
    email: yup
        .string()
        .email('The email is not valid one')
        .required(),
    password: yup
        .string()
        .min(4, 'Password must be atleast 4 characters')
        .required()
})

export const validateUser = (schema) => async (req, res, next) => {
    try {
        await schema.validate(req.body)
        next()
    } catch (err) {
        return res.status(400).json({errors:err.errors})
    }
}