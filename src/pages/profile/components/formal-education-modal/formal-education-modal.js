import React, { useState, useEffect } from 'react';

import { Modal, Form, Input, Row, Col, InputNumber, DatePicker, Select } from 'antd';
import moment from 'moment';
// Services
import { ProfileService } from "../../services/ProfileService";

const FormalEducationEodal = (props) => {
  const { data, visible, closeModalExperience, form, updateItem, typeDetails, setTypeDetails } = props;

  const { MonthPicker } = DatePicker;
  const { TextArea } = Input;
  const { Item } = Form;
  const { Option } = Select

  const [showLoading, setShowLoading] = useState(false)
  const [editableMode, setEditableMode] = useState(false)
  const { getFieldDecorator } = form;

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

      valuesForm = {
        ...valuesForm,
        CulminationYear: parseInt(valuesForm.CulminationYear.format('YYYY'))
        // StartDate: valuesForm.StartDate.format('DD/MM/YYYY'),
        // EndDate: valuesForm.EndDate.format('DD/MM/YYYY'),
      }

      updateItem(editableMode ? { ...data, ...valuesForm } : { ...valuesForm }, editableMode)
        .then(resp => {
          setShowLoading(false)
          if (!resp) return
          closeModalExperience()
        })
    })
  }

  return (
    <Modal
      title="Educación formal"
      okText="Guardar"
      cancelText="Cancelar"
      width="70%"
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
            <Item label="Titulación" style={{ marginBottom: '0.3em' }}>
              {getFieldDecorator('Title', { rules: [{ required: true }], })
                (<Input />)}
            </Item>
          </Col>
        </Row>
        <Row gutter={10}>
          <Col span={24}>
            <Item label="Universidad" style={{ marginBottom: '0.3em' }}>
              {getFieldDecorator('InstitutionName', { rules: [{ required: true }], })
                (<Input />)}
            </Item>
          </Col>
        </Row>
        <Row gutter={10}>
          <Col span={12}>
            <Item label="Nivel educativo" style={{ marginBottom: '0.3em' }}>
              {getFieldDecorator('EducationLevelId', {
                rules: [{ required: true }],
              })
                (<Select
                  placeholder="Selecciona un idioma"
                  // loading={isLoading}
                  showSearch={true}
                  filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                  allowClear={true}>
                  {(typeDetails.ListEducationalLevel || []).map(item => (<Option key={item.Id} value={item.Id}>{item.Name}</Option>))}
                </Select>)}

            </Item>
          </Col>
          <Col span={12}>
            <Item label="Area de estudio" style={{ marginBottom: '0.3em' }}>
              {getFieldDecorator('StudyFieldId', { rules: [{ required: true }], })
                (
                  <Select
                    placeholder="Selecciona un idioma"
                    // loading={isLoading}
                    showSearch={true}
                    filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                    allowClear={true}>
                    {(typeDetails.ListStudyField || []).map(item => (<Option key={item.Id} value={item.Id}>{item.Name}</Option>))}
                  </Select>
                )}
            </Item>
          </Col>
        </Row>
        <Row gutter={10}>
          <Col span={12}>
            <Item label="Año de finalización (o previsto)" style={{ marginBottom: '0.3em' }}>
              {getFieldDecorator('CulminationYear', {
                rules: [{ required: true }],
              })
                (<MonthPicker
                  style={{ width: '100%' }}
                  format={'YYYY'}
                  placeholder="Selecciona una fecha" />)}

            </Item>
          </Col>
          <Col span={12}>
            <Item label="Promedio" style={{ marginBottom: '0.3em' }}>
              {getFieldDecorator('Average', { rules: [{ required: true }], })
                (<InputNumber min={0} max={10} style={{ width: '100%' }} />)}
            </Item>
          </Col>
        </Row>

        <Row gutter={10}>
          <Col span={24}>
            <Item label="Descripción" style={{ marginBottom: '0.3em' }}>
              {getFieldDecorator('StudyFieldDescription')
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
      Title: Form.createFormField({ value: data.Title }),
      InstitutionName: Form.createFormField({ value: data.InstitutionName }),
      CulminationYear: Form.createFormField({ value: moment(data.CulminationYear, 'YYYY/MM/DD') }),
      Average: Form.createFormField({ value: data.Average }),
      EducationLevelId: Form.createFormField({ value: data.EducationLevelId }),
      StudyFieldId: Form.createFormField({ value: data.StudyFieldId }),
      StudyFieldDescription: Form.createFormField({ value: data.StudyFieldDescription }),
    };
  },
})(FormalEducationEodal);

export default WrappedModalForm
