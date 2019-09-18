import React, { useState, useEffect } from 'react';

import { Modal, Form, Input, Row, Col, InputNumber, DatePicker, message } from 'antd';
import moment from 'moment';


const { TextArea } = Input;

const ProjectModal = (props) => {
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

      valuesForm = { ...valuesForm, StartDate: valuesForm.StartDate.format('DD/MM/YYYY') , FinishDate: valuesForm.FinishDate.format('DD/MM/YYYY') }
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
      title="Proyectos"
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
          <Item label="Titulo Proyecto" style={{ marginBottom: '0.3em' }}>
              {getFieldDecorator('Title', { rules: [{ required: true }], })
                (<Input />)}
            </Item>
            
          </Col>
        </Row>
        <Row gutter={10}>
          <Col span={24}>
          <Item label="Tema Proyecto" style={{ marginBottom: '0.3em' }}>
              {getFieldDecorator('Theme', { rules: [{ required: true }], })
                (<Input />)}
            </Item>
            
          </Col>
        </Row>
        <Row gutter={10}>
          <Col span={24}>
          <Item label="Empresa" style={{ marginBottom: '0.3em' }}>
              {getFieldDecorator('Entity', { rules: [{ required: true }], })
                (<Input />)}
            </Item>
          </Col>
        </Row>
        <Row gutter={10}>
          <Col span={12}>
            <Item label="Fecha de inicio del proyecto" style={{ marginBottom: '0.3em' }}>
              {getFieldDecorator('StartDate', {
                rules: [{ required: true }],
              })
                (<DatePicker
                    style={{ width: '100%' }}
                    format={'DD/MM/YYYY'} />)}

            </Item>
          </Col>
          <Col span={12}>
          <Item label="Fecha de finalización del proyecto" style={{ marginBottom: '0.3em' }}>
              {getFieldDecorator('FinishDate')
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
      formFields.StartDate = Form.createFormField({ value: moment(data.StartDate, 'DD/MM/YYYY') })
      formFields.FinishDate = Form.createFormField({ value: moment(data.FinishDate, 'DD/MM/YYYY') })
  
      return formFields
    },
  })(ProjectModal);
  
  export default WrappedModalForm