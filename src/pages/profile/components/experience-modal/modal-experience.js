import React, { useState, useEffect } from 'react';

import { Modal, Form, Input, Row, Col, message, DatePicker } from 'antd';
import moment from 'moment';

const { TextArea } = Input;

const ModalExperience = (props) => {
  const { experienceData, visible, closeModalExperience, form, updateItem } = props;
  const { Item } = Form;

  const [showLoading, setShowLoading] = useState(false)
  const [editableMode, setEditableMode] = useState(false)
  const { getFieldDecorator } = form;

  useEffect(() => {
    if (!visible) return
    setEditableMode(!!experienceData)
  }, [experienceData, visible])

  const handleOk = () => {
    form.validateFieldsAndScroll((err, valuesForm) => {
      if (err) return
      setShowLoading(true)

      valuesForm = {
        ...valuesForm,
        StartDate: valuesForm.StartDate.format('DD/MM/YYYY'),
        EndDate: valuesForm.EndDate.format('DD/MM/YYYY'),
      }

      updateItem(editableMode ? { ...experienceData, ...valuesForm } : { ...valuesForm }, editableMode)
        .then(resp => {
          setShowLoading(false)
          if (!resp) return
          closeModalExperience()
        })
    })

  }

  return (
    <Modal
      title="Agregar Experiencia"
      okText="Guardar"
      cancelText="Cancelar"
      width="90%"
      style={{ top: '60px' }}
      visible={visible}
      onOk={handleOk}
      onCancel={closeModalExperience}
      cancelButtonProps={{ disabled: showLoading }}
      confirmLoading={showLoading}
      closable={!showLoading}
      maskClosable={false}
    >
      <Form layout="vertical">
        <Row gutter={10}>
          <Col span={24}>
            <Item label="Nombre Empresa" style={{ marginBottom: '0.3em' }}>
              {getFieldDecorator('CompanyName', { rules: [{ required: true }], })
                (<Input />)}
            </Item>
          </Col>
        </Row>
        <Row gutter={10}>
          <Col span={24}>
            <Item label="Cargo" style={{ marginBottom: '0.3em' }}>
              {getFieldDecorator('Position', { rules: [{ required: true }], })
                (<Input />)}
            </Item>
          </Col>
        </Row>
        <Row gutter={10}>
          <Col span={24}>
            <Item label="Funciones" style={{ marginBottom: '0.3em' }}>
              {getFieldDecorator('Functions', { rules: [{ required: true }], })
                (<TextArea />)}
            </Item>
          </Col>
        </Row>

        <Row gutter={10}>
          <Col span={12}>
            <Item label="Fecha de inicio" style={{ marginBottom: '0.3em' }}>
              {getFieldDecorator('StartDate', { rules: [{ required: true }] })
                (<DatePicker
                  style={{ width: '100%' }}
                  format={'DD/MM/YYYY'} />)}

            </Item>
          </Col>
          <Col span={12}>
            <Item label="Trabaja actualmente en esta empresa" style={{ marginBottom: '0.3em' }}>
              <Input placeholder="" />
            </Item>
          </Col>
        </Row>
        <Row gutter={10}>
          <Col span={12}>
            <Item label="Fecha Fin" style={{ marginBottom: '0.3em' }}>
              {getFieldDecorator('EndDate', { rules: [{ required: true }] })
                (<DatePicker
                  style={{ width: '100%' }}
                  format={'DD/MM/YYYY'} />)}

            </Item>
          </Col>
          <Col span={12}>
            <Item label="País" style={{ marginBottom: '0.3em' }}>
              {getFieldDecorator('Location', { rules: [{ required: true }], })
                (<Input />)}
            </Item>
          </Col>
        </Row>

      </Form>
    </Modal>
  )
}

const WrappedExperienceForm = Form.create({
  name: 'experienceForm',
  validateMessages: { required: 'El campo es requerido' },
  withRef: false,
  mapPropsToFields({ experienceData }) {
    if (!experienceData) return
    return {
      Id: Form.createFormField({ value: experienceData.Id }),
      CompanyName: Form.createFormField({ value: experienceData.CompanyName }),
      Position: Form.createFormField({ value: experienceData.Position }),
      Functions: Form.createFormField({ value: experienceData.Functions }),
      StartDate: Form.createFormField({ value: moment(experienceData.StartDate, 'YYYY/MM/DD') }),
      EndDate: Form.createFormField({ value: moment(experienceData.EndDate, 'YYYY/MM/DD') }),
      Location: Form.createFormField({ value: experienceData.Location }),
    };
  },
})(ModalExperience);

export default WrappedExperienceForm
