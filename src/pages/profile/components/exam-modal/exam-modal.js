import React, { useState, useEffect } from 'react';

import { Modal, Form, Input, Row, Col, DatePicker, InputNumber } from 'antd';
import moment from 'moment';


const ExamModal = (props) => {
  const { data, visible, closeModal, form, updateItem } = props;

  const { Item } = Form;
  const { getFieldDecorator } = form

  const [showLoading, setShowLoading] = useState(false)
  const [editableMode, setEditableMode] = useState(false)

  useEffect(() => {
    if (!visible) return
    console.log(data);

    setEditableMode(!!data)
  }, [data, visible])

  const handleOk = () => {
    form.validateFieldsAndScroll((err, valuesForm) => {
      if (err) return
      setShowLoading(true)

      valuesForm = {
        ...valuesForm,
        EmissionDate: valuesForm.EmissionDate.format('DD/MM/YYYY'),
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
      title="Exámen"
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
          <Col span={12}>
            <Item label="Nombre de exámen" style={{ marginBottom: '0.3em' }}>
              {getFieldDecorator('Title', { rules: [{ required: true }], })
                (<Input />)}
            </Item>
          </Col>
          <Col span={12}>
            <Item label="Área de conocimiento" style={{ marginBottom: '0.3em' }}>
              {getFieldDecorator('Theme', { rules: [{ required: true }], })
                (<Input />)}
            </Item>
          </Col>
        </Row>
        <Row gutter={10}>
          <Col span={24}>
            <Item label="Entidad" style={{ marginBottom: '0.3em' }}>
              {getFieldDecorator('Entity', { rules: [{ required: true }], })
                (<Input />)}
            </Item>
          </Col>
        </Row>
        <Row gutter={10}>
          <Col span={12}>
            <Item label="Puntuación" style={{ marginBottom: '0.3em' }}>
              {getFieldDecorator('Punctuation', { rules: [{ required: true }], })
                (<InputNumber min={0} max={100} style={{ width: '100%' }} />)}
            </Item>
          </Col>
          <Col span={12}>
            <Item label="Fecha de realización" style={{ marginBottom: '0.3em' }}>
              {getFieldDecorator('EmissionDate', { rules: [{ required: true }], })
                (<DatePicker
                  style={{ width: '100%' }}
                  format={'DD/MM/YYYY'} />)}
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
  mapPropsToFields({ data }) {
    if (!data) return
    return {
      Title: Form.createFormField({ value: data.Title }),
      Theme: Form.createFormField({ value: data.Theme }),
      Entity: Form.createFormField({ value: data.Entity }),
      Punctuation: Form.createFormField({ value: data.Punctuation }),
      EmissionDate: Form.createFormField({ value: moment(data.EmissionDate, 'YYYY/MM/DD') }),
    };
  },
})(ExamModal);

export default WrappedModalForm
