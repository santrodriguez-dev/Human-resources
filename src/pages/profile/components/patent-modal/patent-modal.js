import React, { useState, useEffect } from 'react';

import { Modal, Form, Input, Row, Col, Select, InputNumber, DatePicker } from 'antd';
import moment from 'moment';

const PatentModal = (props) => {
  const { data, visible, closeModal, form, updateItem } = props;

  const { Item } = Form;
  const { Option } = Select
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
      title="Patente"
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
            <Item label="Nombre de patente" style={{ marginBottom: '0.3em' }}>
              {getFieldDecorator('Title', { rules: [{ required: true }], })
                (<Input />)}
            </Item>
          </Col>
          <Col span={12}>
            <Item label="Tema" style={{ marginBottom: '0.3em' }}>
              {getFieldDecorator('Theme', { rules: [{ required: true }], })
                (<Input />)}
            </Item>
          </Col>
        </Row>
        <Row gutter={10}>
          <Col span={12}>
            <Item label="Entidad" style={{ marginBottom: '0.3em' }}>
              {getFieldDecorator('Entity', { rules: [{ required: true }], })
                (<Input />)}
            </Item>
          </Col>
          <Col span={12}>
            <Item label="Oficina" style={{ marginBottom: '0.3em' }}>
              {getFieldDecorator('Office', { rules: [{ required: true }], })
                (<Input />)}
            </Item>
          </Col>
        </Row>
        <Row gutter={10}>
          <Col span={12}>
            <Item label="Fecha de realización" style={{ marginBottom: '0.3em' }}>
              {getFieldDecorator('EmissionDate', { rules: [{ required: true }], })
                (<DatePicker
                  style={{ width: '100%' }}
                  format={'DD/MM/YYYY'} />)}
            </Item>
          </Col>
          <Col span={12}>
            <Item label="Número de patente" style={{ marginBottom: '0.3em' }}>
              {getFieldDecorator('PatentNumber', { rules: [{ required: true }], })
                (<InputNumber min={0} style={{ width: '100%' }} />)}
            </Item>
          </Col>
        </Row>
        <Row gutter={10}>

          <Col span={12}>
            <Item label="Url de patente" style={{ marginBottom: '0.3em' }}>
              {getFieldDecorator('PatentURL', { rules: [{ required: true }], })
                (<Input />)}
            </Item>
          </Col>
          <Col span={12}>
            <Item label="Estado" style={{ marginBottom: '0.3em' }}>
              {getFieldDecorator('State', { rules: [{ required: true }], })
                (<Select
                  placeholder="Selecciona un idioma"
                  // loading={isLoading}
                  showSearch={true}
                  filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                  allowClear={true}>
                  {(['En tramite']).map(item => (<Option key={item} value={item}>{item}</Option>))}
                </Select>)}
            </Item>
          </Col>
        </Row>
        <Row gutter={10}>
          <Col span={24}>
            <Item label="Inventores" style={{ marginBottom: '0.3em' }}>
              {getFieldDecorator('Inventor', { rules: [{ required: true }], })
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
  mapPropsToFields({ data }) {
    if (!data) return
    return {
      Title: Form.createFormField({ value: data.Title }),
      Theme: Form.createFormField({ value: data.Theme }),
      StartDate: Form.createFormField({ value: moment(data.StartDate, 'YYYY/MM/DD') }),
      FinishDate: Form.createFormField({ value: moment(data.FinishDate, 'YYYY/MM/DD') }),
      Entity: Form.createFormField({ value: data.Entity }),
      Office: Form.createFormField({ value: data.Office }),
      Punctuation: Form.createFormField({ value: data.Punctuation }),
      EmissionDate: Form.createFormField({ value: moment(data.EmissionDate, 'YYYY/MM/DD') }),
      PatentNumber: Form.createFormField({ value: data.PatentNumber }),
      PatentURL: Form.createFormField({ value: data.PatentURL }),
      State: Form.createFormField({ value: data.State }),
      Inventor: Form.createFormField({ value: data.Inventor }),
    };
  },
})(PatentModal);

export default WrappedModalForm
