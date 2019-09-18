import React, { useState, useEffect } from 'react';

import { Modal, Form, Input, Row, Col, InputNumber, DatePicker, message } from 'antd';


const SocialMediaModal = (props) => {
  const {data, visible, closeModal, form, updateItem } = props;
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
    form.validateFieldsAndScroll((err, valuesForm) => {
      if (err) return
      setShowLoading(true)

      valuesForm = { ...valuesForm }
      console.log(valuesForm);

      let newProfile = null

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
      title="Redes Sociales"
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
            <Item label="URL Red social" style={{ marginBottom: '0.3em' }}>
              {getFieldDecorator('URL', { rules: [{ required: true }], })
                (<Input />)}
            </Item>
          </Col>
        </Row>
        <Row gutter={10}>
          <Col span={24}>
            <Item label="Nombre red social" style={{ marginBottom: '0.3em' }}>
              {getFieldDecorator('TypeId', { rules: [{ required: true }], })
                (<Input />)}
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
      return formFields
    },
  })(SocialMediaModal);
  
  export default WrappedModalForm
  
