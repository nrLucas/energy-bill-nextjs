import * as yup from "yup";

const validationSchema = yup.object().shape({
    fatura: yup
        .mixed()
        .required("Fatura é obrigatória")
        .test("fileFormat", "O arquivo é obrigatório e precisa ser um PDF", (value: any) => {
            return value && value[0] && value[0].type === "application/pdf";
        }),
});

export default validationSchema;
