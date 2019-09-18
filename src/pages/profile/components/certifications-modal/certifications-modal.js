import React, { useState, useEffect } from 'react';

import { Modal, Form, Input, Row, Col, DatePicker } from 'antd';
import moment from 'moment';

const CertificationsModal = (props) => {
  const { data, visible, closeModal, form, updateItem } = props;
  const { Item } = Form;

  const [showLoading, setShowLoading] = useState(false)
  const [editableMode, setEditableMode] = useState(false)
  const { getFieldDecorator } = form;

  useEffect(() => {
    if (!visible) return
    setEditableMode(!!data)
    console.log(data);
  }, [data, visible])

  const handleOk = () => {
    form.validateFieldsAndScroll((err, valuesForm) => {
      if (err) return
      setShowLoading(true)

      valuesForm = {
        ...valuesForm,
        EmissionDate: valuesForm.EmissionDate.format('DD/MM/YYYY'),
        ExpirationDate: valuesForm.ExpirationDate.format('DD/MM/YYYY'),
      }
      updateItem(editableMode ? { ...data, ...valuesForm } : { ...valuesForm }, editableMode).then(resp => {
        setShowLoading(false)
        if (!resp) return
        closeModal()
      })
    })
  }

  return (
    <Modal
      title="Certificación"
      okText="Guardar"
      cancelText="Cancelar"
      width="90%"
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
          <Col span={12}>
            <Item label="Nombre" style={{ marginBottom: '0.3em' }}>
              {getFieldDecorator('Name', { rules: [{ required: true }], })
                (<Input />)}
            </Item>
          </Col>
          <Col span={12}>
            <Item label="Entidad" style={{ marginBottom: '0.3em' }}>
              {getFieldDecorator('Entity', { rules: [{ required: true }], })
                (<Input />)}
            </Item>
          </Col>
        </Row>
        <Row gutter={10}>
          <Col span={12}>
            <Item label="Fecha de emisión" style={{ marginBottom: '0.3em' }}>
              {getFieldDecorator('EmissionDate', { rules: [{ required: true }] })
                (<DatePicker
                  style={{ width: '100%' }}
                  format={'DD/MM/YYYY'} />)}
            </Item>
          </Col>
          <Col span={12}>
            <Item label="Fecha de expiración" style={{ marginBottom: '0.3em' }}>
              {getFieldDecorator('ExpirationDate', { rules: [{ required: true }], })
                (<DatePicker
                  style={{ width: '100%' }}
                  format={'DD/MM/YYYY'} />)}
            </Item>
          </Col>
        </Row>
        <Row gutter={10}>
          <Col span={12}>
            <Item label="Codigo de certificación" style={{ marginBottom: '0.3em' }}>
              {getFieldDecorator('CredentialID', { rules: [], })
                (<Input />)}
            </Item>
          </Col>
          <Col span={12}>
            <Item label="Url de certificación" style={{ marginBottom: '0.3em' }}>
              {getFieldDecorator('CredentialURL', { rules: [{ required: true }], })
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
    formFields.EmissionDate = Form.createFormField({ value: moment(data.EmissionDate, 'DD/MM/YYYY') })
    formFields.ExpirationDate = Form.createFormField({ value: moment(data.ExpirationDate, 'DD/MM/YYYY') })

    return formFields
  },
})(CertificationsModal);

export default WrappedModalForm
