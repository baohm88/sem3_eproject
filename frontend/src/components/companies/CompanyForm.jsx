import { Formik, Form as FormikForm, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { Button, Form, Row, Col } from "react-bootstrap";
import { updateMyCompany } from "../../api/companies.ts";
import { toast } from "react-toastify";

const CompanySchema = Yup.object().shape({
    name: Yup.string().required("Company name is required"),
    email: Yup.string().email("Invalid email").required("Email is required"),
    status: Yup.string()
        .oneOf(["active", "inactive"])
        .required("Status is required"),
});

export default function CompanyForm({ initialData, onSuccess }) {
    const isEdit = !!initialData;

    return (
        <Formik
            initialValues={{
                name: initialData?.name || "",
                email: initialData?.email || "",
                status: initialData?.status || "active",
            }}
            validationSchema={CompanySchema}
            onSubmit={async (values, { setSubmitting, resetForm }) => {
                try {
                    if (isEdit) {
                        await updateMyCompany(values);
                        toast.success("Company updated successfully!");
                    } else {
                        await updateMyCompany(values);
                        toast.success("Company created successfully!");
                        resetForm();
                    }
                    if (onSuccess) onSuccess();
                } catch (err) {
                    toast.error(
                        err.response?.data?.message || "Operation failed"
                    );
                } finally {
                    setSubmitting(false);
                }
            }}
        >
            {({ isSubmitting, handleSubmit }) => (
                <FormikForm onSubmit={handleSubmit}>
                    <Row className="mb-3">
                        <Col md={6}>
                            <Form.Group controlId="name">
                                <Form.Label>Company Name</Form.Label>
                                <Field
                                    name="name"
                                    as={Form.Control}
                                    placeholder="Enter company name"
                                />
                                <ErrorMessage
                                    name="name"
                                    component="div"
                                    className="text-danger small"
                                />
                            </Form.Group>
                        </Col>

                        <Col md={6}>
                            <Form.Group controlId="email">
                                <Form.Label>Email</Form.Label>
                                <Field
                                    name="email"
                                    as={Form.Control}
                                    placeholder="Enter company email"
                                />
                                <ErrorMessage
                                    name="email"
                                    component="div"
                                    className="text-danger small"
                                />
                            </Form.Group>
                        </Col>
                    </Row>

                    <Row className="mb-3">
                        <Col md={6}>
                            <Form.Group controlId="status">
                                <Form.Label>Status</Form.Label>
                                <Field as={Form.Select} name="status">
                                    <option value="active">Active</option>
                                    <option value="inactive">Inactive</option>
                                </Field>
                                <ErrorMessage
                                    name="status"
                                    component="div"
                                    className="text-danger small"
                                />
                            </Form.Group>
                        </Col>
                    </Row>

                    <Button
                        type="submit"
                        variant={isEdit ? "warning" : "success"}
                        disabled={isSubmitting}
                    >
                        {isSubmitting
                            ? "Submitting..."
                            : isEdit
                            ? "Update Company"
                            : "Add Company"}
                    </Button>
                </FormikForm>
            )}
        </Formik>
    );
}
