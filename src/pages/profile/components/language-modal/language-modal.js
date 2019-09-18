import React, { useState, useEffect } from 'react';

import { Modal, Form, Input, Row, Col, Select } from 'antd';

// Services
import { ProfileService } from "../../services/ProfileService";

const LanguageModal = (props) => {
  const { data, visible, closeModal, form, updateItem, typeDetails, setTypeDetails } = props;

  const { Item } = Form;
  const { Option } = Select
  const { TextArea } = Input
  const { getFieldDecorator } = form

  const [showLoading, setShowLoading] = useState(false)
  const [editableMode, setEditableMode] = useState(false)

  useEffect(() => {
    if (!visible) return
    getTypeDetail()
    setEditableMode(!!data)
  }, [data, visible])

  const getTypeDetail = () => {
    if (Object.keys(typeDetails).length > 0) return
    ProfileService.getProfileTypeDetails()
      .then(typeDetails => {
        if (!typeDetails) return
        setTypeDetails(typeDetails)
      })
  }

  const handleOk = () => {
    form.validateFieldsAndScroll((err, valuesForm) => {
      if (err) return
      setShowLoading(true)

      updateItem(editableMode ? { ...data, ...valuesForm } : { ...valuesForm }, editableMode).then(resp => {
        setShowLoading(false)
        if (!resp) return
        closeModal()
      })
    })
  }

  return (
    <Modal
      title="Idioma"
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
            <Item label="Idioma" style={{ marginBottom: '0.3em' }}>
              {getFieldDecorator('LanguageId', { rules: [{ required: true }], })
                (
                  <Select
                    placeholder="Selecciona un idioma"
                    // loading={isLoading}
                    showSearch={true}
                    filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                    allowClear={true}>
                    {(typeDetails.ListLanguage || []).map(item => (<Option key={item.Id} value={item.Id}>{item.Name}</Option>))}
                  </Select>
                )}
            </Item>
          </Col>
          <Col span={12}>
            <Item label="Nivel de dominio" style={{ marginBottom: '0.3em' }}>
              {getFieldDecorator('DomainLevel', { rules: [{ required: true }], })
                (
                  <Select
                    placeholder="Selecciona un nivel"
                    // loading={isLoading}
                    showSearch={true}
                    filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                    allowClear={true}>
                    {['Básico', 'Intermedio', 'Avanzado'].map(item => (<Option key={item} value={item}>{item}</Option>))}
                  </Select>
                )}
            </Item>
          </Col>
        </Row>
        <Row gutter={10}>
          <Col span={24}>
            <Item label="Descripción" style={{ marginBottom: '0.3em' }}>
              {getFieldDecorator('LanguageDescription')
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
  mapPropsToFields({ data }) {
    if (!data) return
    return {
      LanguageId: Form.createFormField({ value: data.LanguageId }),
      DomainLevel: Form.createFormField({ value: data.DomainLevel }),
      LanguageDescription: Form.createFormField({ value: data.LanguageDescription }),
    };
  },
})(LanguageModal);

export default WrappedModalForm
