import {InputGroup, Col, Form} from 'react-bootstrap';

function SimpleField({value, setValue, label, id})
{
    return (
        <Form.Group as={Col}>
            <Form.Label htmlFor={id} column={"sm"}>{label}</Form.Label>
            <Form.Control required id={id} value={value} onChange={(e)=>{
                setValue(e.target.value);
            }}></Form.Control>
        </Form.Group>
    );
}

export default SimpleField;