import React, { useState, useEffect } from 'react';

import {  Modal, Form, Input, Row, Col, Select, DatePicker, Upload, Icon, message } from 'antd';
import moment from 'moment';


//Services
import { ProfileService } from "../../services/ProfileService";

const { TextArea } = Input;

const FamilyModal = (props) => {
  const {  data, visible, closeModal, form, updateItem } = props;
  const { Item } = Form;
  const [isLoading, setIsLoading] = useState(false)
  const [showLoading, setShowLoading] = useState(false)
  const [editableMode, setEditableMode] = useState(false)
  const [listGeneral, setListGeneral] = useState({})
  const { getFieldDecorator } = form;

  const { Option } = Select;

  useEffect(() => {
    if (!visible) return
    setEditableMode(!!data)
    getInitials();
    console.log(data);
  }, [data, visible])

  const getInitials = () => {
    setIsLoading(true)
    ProfileService.getProfileTypeDetails()
      .then(response => {
        setIsLoading(false)
        setListGeneral(response)
      })
  }

  const handleOk = () => {
    form.validateFieldsAndScroll((err, valuesForm) => {
      if (err) return
      setShowLoading(true)

      valuesForm = {
        ...valuesForm,
      }
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
      title="Información familiar"
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
          <Col xs={24} md={12}>
            <Item label="Nombres" style={{ marginBottom: '0.3em' }}>
              {getFieldDecorator('Name', { rules: [{ required: true }], })
                (<Input />)}
            </Item>
          </Col>
          <Col xs={24} md={12}>
            <Item label="Apellidos" style={{ marginBottom: '0.3em' }}>
              {getFieldDecorator('LastName', { rules: [{ required: true }], })
                (<Input />)}
            </Item>
          </Col>
        </Row>
        <Row gutter={10}>
          <Col xs={24} md={12}>
            <Item label="Tipo de documento" style={{ marginBottom: '0.3em' }}>
              {getFieldDecorator('TypeDocumentId',
                {
                  rules: [{ required: true, message: 'Se requiere que escoja su tipo de documento' }],
                }
              )(
                <Select
                  placeholder="Selecione Tipo de documento"
                  loading={isLoading}
                  allowClear={true}>
                  {(listGeneral.ListDocument || []).map(item => {
                    return (
                      <Option key={item.Id} value={item.Id}>{item.Name}</Option>
                    )
                  })}
                </Select>)}
            </Item>
          </Col>
          <Col xs={24} md={12}>
            <Item label="Número de documento" style={{ marginBottom: '0.3em' }}>
              {getFieldDecorator('Document', { rules: [{ required: true }], })
                (<Input />)}
            </Item>
          </Col>
        </Row>
        <Row gutter={10}>
          <Col xs={24} md={12}>
            <Item label="Tipo de familiar" style={{ marginBottom: '0.3em' }}>
              {getFieldDecorator('FamilyTypeId',
                {
                  rules: [{ required: true, message: 'Se requiere que escoja su tipo de documento' }],
                }
              )(
                <Select
                  placeholder="Selecione Tipo de familiar"
                  loading={isLoading}
                  allowClear={true}>
                  {(listGeneral.ListFamily || []).map(item => {
                    return (
                      <Option key={item.Id} value={item.Id}>{item.Name}</Option>
                    )
                  })}
                </Select>)}
            </Item>
          </Col>
          <Col xs={24} md={12}>
            <Item label="¿Vive con la persona?" style={{ marginBottom: '0.3em' }}>
              {getFieldDecorator('Coexistence')
                (<Select
                  placeholder="Indique si vive con la persona">
                  <Option value={0}>No</Option>
                  <Option value={1}>Si</Option>
                </Select>)}
            </Item>
          </Col>
        </Row>
        <Row gutter={10}>
          <Col xs={24} md={12}>
            <Item label="¿Posee discapacidad?" style={{ marginBottom: '0.3em' }}>
              {getFieldDecorator('Disability')
                (<Select
                  placeholder="Indique si posee discapacidad">
                  <Option value={0}>No</Option>
                  <Option value={1}>Si</Option>
                </Select>)}
            </Item>
          </Col>
          <Col xs={24} md={12}>
            <Item label="Tipo de discapacidad" style={{ marginBottom: '0.3em' }}>
              {getFieldDecorator('TypeDisabilityId')
                (<Select
                  placeholder="Seleccione tipo de discapacidad">
                  <Option value="Fisica">Fisica</Option>
                  <Option value="Mental">Mental</Option>
                  <Option value="Cognitiva">Cognitiva</Option>
                </Select>)}
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
})(FamilyModal);

export default WrappedModalForm
