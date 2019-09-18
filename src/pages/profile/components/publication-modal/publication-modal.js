import React, { useState, useEffect } from 'react';

import { Modal, Form, Input, Row, Col, InputNumber, DatePicker, message } from 'antd';
import moment from 'moment';


const { TextArea } = Input;

const PublicationModal = (props) => {
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
    form.validateFieldsAndScroll((err, valuesForm) => {
      if (err) return
      setShowLoading(true)

      valuesForm = { ...valuesForm,  EmissionDate: valuesForm.EmissionDate.format('DD/MM/YYYY') }
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
      title="Publicaciones"
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
          <Item label="Titulo publicación" style={{ marginBottom: '0.3em' }}>
              {getFieldDecorator('Title', { rules: [{ required: true }], })
                (<Input />)}
            </Item>
            
          </Col>
        </Row>
        <Row gutter={10}>
          <Col span={24}>
          <Item label="Tema publicación" style={{ marginBottom: '0.3em' }}>
              {getFieldDecorator('Theme', { rules: [{ required: true }], })
                (<Input />)}
            </Item>
            
          </Col>
        </Row>
        <Row gutter={10}>
          <Col span={24}>
          <Item label="URL publicación" style={{ marginBottom: '0.3em' }}>
              {getFieldDecorator('PatentURL')
                (<Input />)}
            </Item>
          </Col>
        </Row>
        <Row gutter={10}>
        <Col span={12}>
          <Item label="Entidad que la emite" style={{ marginBottom: '0.3em' }}>
              {getFieldDecorator('Entity', { rules: [{ required: true }], })
                (<Input />)}
            </Item>
          </Col>
          <Col span={12}>
            <Item label="Fecha de publicación" style={{ marginBottom: '0.3em' }}>
              {getFieldDecorator('EmissionDate', {
                rules: [{ required: true }],
              })
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
    mapPropsToFields({ data, visible }) {
      if (!data || !visible) return
      let formFields = {}
      for (const key in data) {
        formFields = { ...formFields, [key]: Form.createFormField({ value: data[key] }) }
      }
      formFields.EmissionDate = Form.createFormField({ value: moment(data.EmissionDate, 'DD/MM/YYYY') })
      
      return formFields
    },
  })(PublicationModal);
  
  export default WrappedModalForm