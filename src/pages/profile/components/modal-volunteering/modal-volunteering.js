import React, { useState, useEffect } from 'react';

import { Modal, Form, Input, Row, Col, InputNumber, DatePicker, message } from 'antd';
import moment from 'moment';

//Services
import { ProfileService } from "../../services/ProfileService";

const { TextArea } = Input;

const VolunteeringModal = (props) => {
  const { data, visible, closeModal, form, updateItem } = props;
  const { Item } = Form;

  const [showLoading, setShowLoading] = useState(false)
  const [editableMode, setEditableMode] = useState(false)
  const { getFieldDecorator } = form;

  useEffect(() => {

  }, [])

  useEffect(() => {
    if (!visible) return
    setEditableMode(!!data)
    console.log(data);
  }, [data, visible])

  const handleOk = () => {
    debugger
    form.validateFieldsAndScroll((err, valuesForm) => {
      if (err) return
      setShowLoading(true)

      valuesForm = { ...valuesForm, StartDate: valuesForm.StartDate.format('DD/MM/YYYY') , EndDate: valuesForm.EndDate.format('DD/MM/YYYY') }
      console.log(valuesForm);

      updateItem(editableMode ? { ...data, ...valuesForm } : { ...valuesForm }, editableMode)
        .then(resp => {
          setShowLoading(false)
          if (!resp) return
          closeModal()
        })
    })
  }

  return (
    <Modal
      title="Voluntariados"
      okText="Guardar"
      cancelText="Cancelar"
      width="70%"
      style={{ top: '60px' }}
      visible={visible}
      onOk={handleOk}
      onCancel={closeModal}
      cancelButtonProps={{ disabled: showLoading }}
      confirmLoading={showLoading}
      closable={!showLoading}
      maskClosable={false}
    >
      <Form layout="vertical">
        <Row gutter={10}>
          <Col span={24}>
            <Item label="Rol" style={{ marginBottom: '0.3em' }}>
              {getFieldDecorator('Role', { rules: [{ required: true }], })
                (<Input />)}
            </Item>
          </Col>
        </Row>
        <Row gutter={10}>
          <Col span={24}>
            <Item label="Institución (ONG)" style={{ marginBottom: '0.3em' }}>
              {getFieldDecorator('Organization', { rules: [{ required: true }], })
                (<Input />)}
            </Item>
          </Col>
        </Row>
        <Row gutter={10}>
          <Col span={12}>
            <Item label="Fecha de inicio en la ONG" style={{ marginBottom: '0.3em' }}>
              {getFieldDecorator('StartDate', {
                rules: [{ required: true }],
              })
                (<DatePicker
                    style={{ width: '100%' }}
                    format={'DD/MM/YYYY'} />)}

            </Item>
          </Col>
          <Col span={12}>
          <Item label="Fecha de retiro de la ONG" style={{ marginBottom: '0.3em' }}>
              {getFieldDecorator('EndDate')
                (<DatePicker
                    style={{ width: '100%' }}
                    format={'DD/MM/YYYY'} />)}

            </Item>
          </Col>

        </Row>

        <Row gutter={10}>
          <Col span={24}>
            <Item label="Descripción funciones" style={{ marginBottom: '0.3em' }}>
              {getFieldDecorator('Cause', { rules: [{ required: true }], })
                (<TextArea />)}
            </Item>
          </Col>
        </Row>
      </Form>
    </Modal>
  )
}

const WrappedModalForm = Form.create({
    name: 'wrappedForm',
    validateMessages: { required: (args) => 'Este campo es obligatorio' },
    mapPropsToFields({ data, visible }) {
      if (!data || !visible) return
      let formFields = {}
      for (const key in data) {
        formFields = { ...formFields, [key]: Form.createFormField({ value: data[key] }) }
      }
      formFields.StartDate = Form.createFormField({ value: moment(data.StartDate, 'DD/MM/YYYY') })
      formFields.EndDate = Form.createFormField({ value: moment(data.EndDate, 'DD/MM/YYYY') })
  
      return formFields
    },
  })(VolunteeringModal);
  
  export default WrappedModalForm