import { Formik, Form as FormikForm, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { Button, Form, Row, Col } from "react-bootstrap";
import { updateMyDriverProfile } from "../../api/drivers.ts";
import { toast } from "react-toastify";

// Validation schema
const DriverSchema = Yup.object().shape({
    name: Yup.string().required("Name is required"),
    licenseNumber: Yup.string().required("License Number is required"),
    status: Yup.string()
        .oneOf(["active", "inactive"])
        .required("Status is required"),
});

export default function DriverForm({ initialData, onSuccess }) {
    // Nếu có initialData thì là Edit, còn không thì Add
    const isEdit = !!initialData;

    return (
        <Formik
            initialValues={{
                name: initialData?.name || "",
                licenseNumber: initialData?.licenseNumber || "",
                status: initialData?.status || "active",
            }}
            validationSchema={DriverSchema}
            onSubmit={async (values, { setSubmitting, resetForm }) => {
                try {
                    if (isEdit) {
                        // Update
                        await updateMyDriverProfile(values);
                        toast.success("Driver updated successfully!");
                    } else {
                        // Create
                        await updateMyDriverProfile(values);
                        toast.success("Driver created successfully!");
                        resetForm();
                    }
                    if (onSuccess) onSuccess(); // callback để refresh list
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
                                <Form.Label>Name</Form.Label>
                                <Field
                                    name="name"
                                    as={Form.Control}
                                    placeholder="Enter driver's name"
                                />
                                <ErrorMessage
                                    name="name"
                                    component="div"
                                    className="text-danger small"
                                />
                            </Form.Group>
                        </Col>

                        <Col md={6}>
                            <Form.Group controlId="licenseNumber">
                                <Form.Label>License Number</Form.Label>
                                <Field
                                    name="licenseNumber"
                                    as={Form.Control}
                                    placeholder="Enter license number"
                                />
                                <ErrorMessage
                                    name="licenseNumber"
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
                            ? "Update Driver"
                            : "Add Driver"}
                    </Button>
                </FormikForm>
            )}
        </Formik>
    );
}
