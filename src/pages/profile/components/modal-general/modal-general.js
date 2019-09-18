import React, { useEffect, useState } from 'react';

import { Modal, Form, Input, Row, Col, Select, DatePicker, Upload, Icon, message } from 'antd';
import moment from 'moment';

//Services
import { ProfileService } from "../../services/ProfileService";
import { LocationService } from "../../services/LocationService";

const ModalGeneral = (props) => {
  const { visible, profile, setProfile, closeModal } = props;
  const [listGeneral, setListGeneral] = useState({})
  const [isLoading, setIsLoading] = useState(false)
  const [imageUrl, setImageUrl] = useState('')
  const [countriesB, setCountriesB] = useState([])
  const [departmentsB, setDepartmentsB] = useState([])
  const [citiesB, setCitiesB] = useState([])
  const [countries, setCountries] = useState([])
  const [departments, setDepartments] = useState([])
  const [cities, setCities] = useState([])

  const { Item } = Form;
  const { Option } = Select;

  useEffect(() => {
    if (!visible) return
    setImageUrl(profile.Photo)
    getInitialLists()
  }, [visible]);

  const getInitialLists = () => {
    getLocationsByParent(profile.BirthCountryId, 'BD')
    getLocationsByParent(profile.CountryId, 'D')
    getLocationsByParent(profile.BirthDepartmentId, 'BC')
    getLocationsByParent(profile.DepartmentId, 'C')
    setIsLoading(true)
    Promise.all([
      ProfileService.getProfileTypeDetails(),
      LocationService.getListLocation()
    ]).then(([typeDetail, countries]) => {
      setIsLoading(false)
      setListGeneral(typeDetail)
      setCountriesB(countries)
      setCountries(countries)
    })
  }

  function getLocationsByParent(parentId, type) {
    setIsLoading(true)
    LocationService.getListLocation(parentId)
      .then(locations => {
        setIsLoading(false)
        switch (type) {
          case 'BD':
            setDepartmentsB(locations)
            break;
          case 'BC':
            setCitiesB(locations)
            break;
          case 'D':
            setDepartments(locations)
            break;
          case 'C':
            setCities(locations)
            break;
          default:
            break;
        }
      })
  }

  function onSubmit(e) {
    props.form.validateFieldsAndScroll((err, valuesForm) => {
      if (err) return
      setIsLoading(true)
      const profileSave = {
        ...valuesForm,
        Id: profile.Id,
        CreationUser: profile.CreationUser,
        Photo: imageUrl,
        DocumentExpeditionCountryId: profile.DocumentExpeditionCountryId,
        DocumentExpeditionDepartmentId: profile.DocumentExpeditionDepartmentId,
        DocumentExpeditionCityId: profile.DocumentExpeditionCityId,
        Code: profile.Code,
        Status: profile.Status,
        CreationDate: profile.CreationDate,
        BirthDate: valuesForm.BirthDate.format('DD/MM/YYYY'),
      }

      ProfileService.updateProfile(profileSave)
        .then(response => {
          setIsLoading(false)

          if (!response) {
            message.error('No se ha podido actualizar el perfil', 4)
          }
          message.success('Se ha modificado el perfil exitosamente', 4)
          setProfile({ ...profile, ...profileSave })
          closeModal()
        })
    });
  }

  {/*url de la foto*/ }
  function getBase64(img, callback) {
    const reader = new FileReader();
    reader.addEventListener('load', () => callback(reader.result));
    reader.readAsDataURL(img);
  }

  function beforeUpload(file) {
    const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
    if (!isJpgOrPng) {
      message.error('You can only upload JPG/PNG file!');
    }
    const isLt2M = file.size / 1024 / 1024 < 2;
    if (!isLt2M) {
      message.error('Image must smaller than 2MB!');
    }
    return isJpgOrPng && isLt2M;
  }

  const handleChange = info => {
    if (info.file.status === 'uploading') {
      setIsLoading(true)
      return;
    }
    if (info.file.status === 'done') {
      // Get this url from response in real world.
      getBase64(info.file.originFileObj, imageUrl => {

        setImageUrl(imageUrl)
        setIsLoading(false)
      });
    }
  };

  const uploadButton = (
    <div>
      <Icon type={isLoading ? 'loading' : 'plus'} />
      <div className="ant-upload-text">Upload</div>
    </div>
  );

  ///Cambio de la fecha
  function onChange(value, dateString) {
    //debugger
    {/*console.log('Selected Time: ', value);
  console.log('Formatted Selected Time: ', dateString);*/}
    // setBirthDate(value);

  }

  const { getFieldDecorator } = props.form;

  return (
    <Modal
      title="Información General"
      okText="Guardar"
      cancelText="Cancelar"
      width="95vw"
      style={{ top: '20px' }}
      visible={visible}
      onOk={onSubmit}
      onCancel={closeModal}
      confirmLoading={isLoading}
    >
      <Form layout="vertical" onSubmit={onSubmit}>

        {/*Fila 1 ---- tratamiento - nombres - Apellidos - Genero - tipo doc - documento*/}
        <Row gutter={10}>
          <Col xs={24} md={6}>
            <Upload
              style={{ width: '100% !important' }}
              name="avatar"
              listType="picture-card"
              className="avatar-uploader"
              showUploadList={false}
              action="https://www.mocky.io/v2/5cc8019d300000980a055e76"
              beforeUpload={beforeUpload}
              onChange={handleChange}
            >
              {imageUrl ? <img src={imageUrl} alt="avatar" style={{ width: '100%' }} /> : uploadButton}
            </Upload>
          </Col>
          <Col xs={24} md={6}>
            <Item label="Tratamiento" style={{ marginBottom: '0.3em' }}>
              {getFieldDecorator('Treatment',
                {
                  rules: [{ required: true }],
                }
              )(
                <Select
                  placeholder="Señor">
                  <Option value="Sr">Señor</Option>
                  <Option value="Sra">Señora</Option>
                  <Option value="Srita">Señorita</Option>
                </Select>)}
            </Item>
          </Col>
          <Col xs={24} md={6}>
            <Item label="Nombres" style={{ marginBottom: '0.3em' }}>
              {getFieldDecorator('FirstName',
                {
                  rules: [
                    {
                      required: true,
                      message: 'Por favor ingresar un nombre',
                    },
                  ],
                }
              )(<Input />)}
            </Item>
          </Col>
          <Col xs={24} md={6}>
            <Item label="Apellidos" style={{ marginBottom: '0.3em' }}>
              {getFieldDecorator('LastName',
                {
                  rules: [
                    {
                      required: true,
                      message: 'Por favor ingresar apellidos',
                    },
                  ],
                })(<Input />)}
            </Item>
          </Col>
          <Col xs={24} md={6}>
            <Item label="Genero" style={{ marginBottom: '0.3em' }}>

              {getFieldDecorator('Gender',
                {
                  rules: [{ required: true, message: 'Se requiere que escoja su género' }],
                }
              )(
                <Select
                  allowClear={true}
                  showSearch={true}
                  placeholder="Masculino">
                  <Option value="Masculino">Masculino</Option>
                  <Option value="Femenino">Femenino</Option>
                </Select>
              )}
            </Item>
          </Col>
          <Col xs={24} md={6}>
            <Item label="Tipo Documento" style={{ marginBottom: '0.3em' }}>
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
          <Col xs={24} md={6}>
            <Item label="Número de documento" style={{ marginBottom: '0.3em' }}>
              {getFieldDecorator('Document',
                {
                  rules: [{ required: true, message: 'Se requiere número de identificación' }],
                }
              )(<Input />)}
            </Item>
          </Col>
        </Row>
        {/*Fila 2 ---- fech nacimiento - pais - dto - ciudad de nacimiento */}
        <Row gutter={10}>
          <Col xs={24} md={6}>
            <Item label="Fecha de nacimiento" style={{ marginBottom: '0.3em' }}>
              {getFieldDecorator('BirthDate', { rules: [{ required: true }] })
                (
                  <DatePicker
                    style={{ width: '100%' }} />
                )}
            </Item>
          </Col>
          <Col xs={24} md={6}>
            <Item label="Pais de nacimiento" style={{ marginBottom: '0.3em' }}>
              {getFieldDecorator('BirthCountryId',
                {
                  rules: [{ required: true, message: 'Se requiere pais de nacimiento' }],
                }
              )(
                <Select
                  placeholder="Selecciona país"
                  loading={isLoading}
                  showSearch={true}
                  onSelect={(id) => getLocationsByParent(id, 'BD')}
                  filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                  allowClear={true}>
                  {countriesB.map(country => (<Option key={country.Id} value={country.Id}>{country.Name}</Option>))}
                </Select>
              )}
            </Item>
          </Col>
          <Col xs={24} md={6}>
            <Item label="Departamento de nacimiento" style={{ marginBottom: '0.3em' }}>
              {getFieldDecorator('BirthDepartmentId',
                {
                  rules: [{ required: true, message: 'Se requiere departamento de nacimiento' }],
                }
              )(
                <Select
                  placeholder="Selecciona departamento"
                  loading={isLoading}
                  showSearch={true}
                  onSelect={(id) => getLocationsByParent(id, 'BC')}
                  filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                  allowClear={true}>
                  {departmentsB.map(department => (<Option key={department.Id} value={department.Id}>{department.Name}</Option>))}
                </Select>
              )}
            </Item>
          </Col>
          <Col xs={24} md={6}>
            <Item label="Ciudad de nacimiento" style={{ marginBottom: '0.3em' }}>
              {getFieldDecorator('BirthCityId',
                {
                  rules: [{ required: true, message: 'Se requiere ciudad de nacimiento' }],
                }
              )(
                <Select
                  placeholder="Seleccione la ciudad"
                  loading={isLoading}
                  showSearch={true}
                  filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                  allowClear={true}>
                  {citiesB.map(city => (<Option key={city.Id} value={city.Id}>{city.Name}</Option>))}
                </Select>
              )}
            </Item>
          </Col>
        </Row>
        {/*Fila 3 ---- pais - dto - ciudad exp docu   
        <Row gutter={10}>
          <Col span={8}>
            <Item label="Pais de expedición del documento" style={{ marginBottom: '0.3em' }}>
              <Select placeholder="Bogota">
                <Option value="Bogota">Bogota</Option>
                <Option value="Medellin">Medellin</Option>
                <Option value="Cali">Cali</Option>
              </Select>
            </Item>
          </Col>
          <Col span={8}>
            <Item label="Departamento de expedición del documento" style={{ marginBottom: '0.3em' }}>
              <Select placeholder="Bogota">
                <Option value="Bogota">Bogota</Option>
                <Option value="Medellin">Medellin</Option>
                <Option value="Cali">Cali</Option>
              </Select>
            </Item>
          </Col>
          <Col span={8}>
            <Item label="Ciudad de expedición del documento" style={{ marginBottom: '0.3em' }}>
              <Select placeholder="Bogota">
                <Option value="Bogota">Bogota</Option>
                <Option value="Medellin">Medellin</Option>
                <Option value="Cali">Cali</Option>
              </Select>
            </Item>
          </Col>
        </Row>*/}
        {/*Fila 3 ---- pais - dto - ciudad residencia   */}
        <Row gutter={10}>
          <Col xs={24} md={8}>
            <Item label="Pais de residencia" style={{ marginBottom: '0.3em' }}>
              {getFieldDecorator('CountryId',
                {
                  rules: [{ required: true, message: 'Se requiere pais de residencia' }],
                }
              )(
                <Select
                  placeholder="Selecciona país"
                  loading={isLoading}
                  showSearch={true}
                  onSelect={(id) => getLocationsByParent(id, 'D')}
                  filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                  allowClear={true}>
                  {countries.map(country => (<Option key={country.Id} value={country.Id}>{country.Name}</Option>))}
                </Select>
              )}
            </Item>
          </Col>
          <Col xs={24} md={8}>
            <Item label="Departamento de residencia" style={{ marginBottom: '0.3em' }}>
              {getFieldDecorator('DepartmentId',
                {
                  rules: [{ required: true, message: 'Se requiere departamento de residencia' }],
                }
              )(
                <Select
                  placeholder="Selecciona departamento"
                  loading={isLoading}
                  showSearch={true}
                  onSelect={(id) => getLocationsByParent(id, 'C')}
                  filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                  allowClear={true}>
                  {departments.map(department => (<Option key={department.Id} value={department.Id}>{department.Name}</Option>))}
                </Select>
              )}
            </Item>
          </Col>
          <Col xs={24} md={8}>
            <Item label="Ciudad de residencia" style={{ marginBottom: '0.3em' }}>
              {getFieldDecorator('CityId',
                {
                  rules: [{ required: true, message: 'Se requiere ciudad de residencia' }],
                }
              )(
                <Select
                  placeholder="Seleccione la ciudad"
                  loading={isLoading}
                  showSearch={true}
                  filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                  allowClear={true}>
                  {cities.map(city => (<Option key={city.Id} value={city.Id}>{city.Name}</Option>))}
                </Select>
              )}
            </Item>
          </Col>
        </Row>
        {/*Fila 4 ---- estado civil - direccion - telefono  */}
        <Row gutter={10}>
          <Col xs={24} md={8}>
            <Item label="Estado Civil" style={{ marginBottom: '0.3em' }}>
              {getFieldDecorator('CivilStatus',
                {
                  rules: [{ required: true, message: 'Se requiere que escoja estado civil' }],
                }
              )(<Select
                placeholder="Soltero">
                <Option value="Soltero">Soltero</Option>
                <Option value="Casado">Casado</Option>
                <Option value="Union Libre">Union Libre</Option>
              </Select>
              )}
            </Item>
          </Col>
          <Col xs={24} md={8}>
            <Item label="Dirección" style={{ marginBottom: '0.3em' }}>
              {getFieldDecorator('Address',
                {
                  rules: [{ required: true }],
                })(<Input />)}
            </Item>
          </Col>
          <Col xs={24} md={8}>
            <Item label="Telefono" style={{ marginBottom: '0.3em' }}>
              {getFieldDecorator('Telephone')(<Input />)}
            </Item>
          </Col>
        </Row>
        {/*Fila 5 ---- celular - celular empresarial - email - email empresarial  */}
        <Row gutter={10}>
          <Col xs={24} md={6}>
            <Item label="Celular" style={{ marginBottom: '0.3em' }}>
              {getFieldDecorator('Mobile',
                {
                  rules: [{ required: true, message: 'Se requiere un numero de celular' }],
                })(<Input />)}
            </Item>
          </Col>
          <Col xs={24} md={6}>
            <Item label="Celular Empresarial" style={{ marginBottom: '0.3em' }}>
              {getFieldDecorator('MobileCompany')(<Input />)}
            </Item>
          </Col>
          <Col xs={24} md={6}>
            <Item label="Email" style={{ marginBottom: '0.3em' }}>
              {getFieldDecorator('Email',
                {
                  rules: [{ required: true, type: 'email', message: 'Se requiere un E-mail valido' }],
                })(<Input />)}
            </Item>
          </Col>
          <Col xs={24} md={6}>
            <Item label="Email Empresarial" style={{ marginBottom: '0.3em' }}>
              {getFieldDecorator('EmailCompany',
                {
                  rules: [{ required: true, type: 'email', message: 'Se requiere un E-mail valido' }],
                })(<Input />)}
            </Item>
          </Col>
        </Row>
        {/*Fila 6 ---- profesion - nivel educativo - rh - tipo de sangre  */}
        <Row gutter={10}>
          <Col xs={24} md={6}>
            <Item label="Profesión" style={{ marginBottom: '0.3em' }}>
              {getFieldDecorator('Profession',
                {
                  rules: [{ required: true, message: 'Se requiere una profesión' }],
                })(<Input />)}
            </Item>
          </Col>
          <Col xs={24} md={6}>
            <Item label="Nivel Educativo" style={{ marginBottom: '0.3em' }}>
              {getFieldDecorator('EducationLevelId',
                {
                  rules: [{ required: true, message: 'El campo es requerido' }],
                })(<Select
                  placeholder="Seleciona nivel educativo"
                  loading={isLoading}
                  allowClear={true}>
                  {(listGeneral.ListEducationalLevel || []).map(item => {
                    return (
                      <Option key={item.Id} value={item.Id}>{item.Name}</Option>
                    )
                  })}
                </Select>)}
            </Item>
          </Col>
          <Col xs={24} md={6}>
            <Item label="RH" style={{ marginBottom: '0.3em' }}>
              {getFieldDecorator('RH',
                {
                  rules: [{ required: true, message: 'El campo es requerido' }],
                })(<Select
                  placeholder="Selecione RH"
                  loading={isLoading}
                  allowClear={true}>
                  {(listGeneral.ListRh || []).map(item => {
                    return (
                      <Option key={item.Id} value={item.Id}>{item.Name}</Option>
                    )
                  })}
                </Select>)}
            </Item>
          </Col>
          <Col xs={24} md={6}>
            <Item label="Grupo Sanguineo" style={{ marginBottom: '0.3em' }}>
              {getFieldDecorator('BloodTypeId',
                {
                  rules: [{ required: true, message: 'El campo es requerido' }],
                })(<Select
                  placeholder="Selecione grupo sanguineo"
                  loading={isLoading}
                  allowClear={true}>
                  {(listGeneral.ListBloodType || []).map(item => {
                    return (
                      <Option key={item.Id} value={item.Id}>{item.Name}</Option>
                    )
                  })}
                </Select>)}
            </Item>
          </Col>
        </Row>
        {/*Fila 7 ---- eps - afp -cesantia  */}
        <Row gutter={10}>
          <Col xs={24} md={8}>
            <Item label="EPS" style={{ marginBottom: '0.3em' }}>
              {getFieldDecorator('Eps',
                {
                  rules: [{ required: true, message: 'El campo es requerido' }],
                })(<Select
                  placeholder="Selecione EPS"
                  loading={isLoading}
                  allowClear={true}>
                  {(listGeneral.ListEps || []).map(item => {
                    return (
                      <Option key={item.Id} value={item.Id}>{item.Name}</Option>
                    )
                  })}
                </Select>)}
            </Item>
          </Col>
          <Col xs={24} md={8}>
            <Item label="AFP" style={{ marginBottom: '0.3em' }}>
              {getFieldDecorator('Afp',
                {
                  rules: [{ required: true, message: 'El campo es requerido' }],
                })(<Select
                  placeholder="Selecione AFP"
                  loading={isLoading}
                  allowClear={true}>
                  {(listGeneral.ListAfp || []).map(item => {
                    return (
                      <Option key={item.Id} value={item.Id}>{item.Name}</Option>
                    )
                  })}
                </Select>)}
            </Item>
          </Col>
          <Col xs={24} md={8}>
            <Item label="Cesantias" style={{ marginBottom: '0.3em' }}>
              {getFieldDecorator('Cesantias',
                {
                  rules: [{ required: true, message: 'El campo es requerido' }],
                })(<Select
                  placeholder="Selecione Fondo de cesantias"
                  loading={isLoading}
                  allowClear={true}>
                  {(listGeneral.ListCesantia || []).map(item => {
                    return (
                      <Option key={item.Id} value={item.Id}>{item.Name}</Option>
                    )
                  })}
                </Select>)}
            </Item>
          </Col>
        </Row>
        {/*Fila 8 ---- grupo etnico - etnia -religion  */}
        <Row gutter={10}>
          <Col xs={24} md={8}>
            <Item label="Grupo Etnico" style={{ marginBottom: '0.3em' }}>
              {getFieldDecorator('EthnicityGroupId',
                {
                  rules: [{ required: true, message: 'El campo es requerido' }],
                })(<Select
                  placeholder="Seleciona AFP"
                  loading={isLoading}
                  allowClear={true}>
                  {(listGeneral.ListEthnicityGroup || []).map(item => {
                    return (
                      <Option key={item.Id} value={item.Id}>{item.Name}</Option>
                    )
                  })}
                </Select>)}
            </Item>
          </Col>
          <Col xs={24} md={8}>
            <Item label="Etnia" style={{ marginBottom: '0.3em' }}>
              {getFieldDecorator('EthnicityId',
                {
                  rules: [{ required: true, message: 'El campo es requerido' }],
                })(<Select
                  placeholder="Seleciona AFP"
                  loading={isLoading}
                  allowClear={true}>
                  {(listGeneral.ListEthnicity || []).map(item => {
                    return (
                      <Option key={item.Id} value={item.Id}>{item.Name}</Option>
                    )
                  })}
                </Select>)}
            </Item>
          </Col>
          <Col xs={24} md={8}>
            <Item label="Religión" style={{ marginBottom: '0.3em' }}>
              {getFieldDecorator('Religion',
                {
                  rules: [{ required: true, message: 'El campo es requerido' }],
                })(<Select
                  placeholder="Selecione religion"
                  loading={isLoading}
                  allowClear={true}>
                  {(listGeneral.ListReligion || []).map(item => {
                    return (
                      <Option key={item.Id} value={item.Id}>{item.Name}</Option>
                    )
                  })}
                </Select>)}
            </Item>
          </Col>
        </Row>
        {/*Fila 9 ---- tipo vivienda - zona residencial - estrato - cantidad de dependientes  */}
        <Row gutter={10}>
          <Col xs={24} md={6}>
            <Item label="Tipo de Vivienda" style={{ marginBottom: '0.3em' }}>
              {getFieldDecorator('HousingTypeId')
                (<Select
                  placeholder="Seleciona tipo de vivienda"
                  loading={isLoading}
                  allowClear={true}>
                  {(listGeneral.ListHousingType || []).map(item => {
                    return (
                      <Option key={item.Id} value={item.Id}>{item.Name}</Option>
                    )
                  })}
                </Select>)}
            </Item>
          </Col>
          <Col xs={24} md={6}>
            <Item label="Zona Residencial" style={{ marginBottom: '0.3em' }}>
              {getFieldDecorator('ResidentialZone')
                (<Select
                  placeholder="Seleccione zona residencial">
                  <Option value="Rural">Rural</Option>
                  <Option value="Urbana">Urbana</Option>
                </Select>)}
            </Item>
          </Col>
          <Col xs={24} md={6}>
            <Item label="Estrato Socioeconomico" style={{ marginBottom: '0.3em' }}>
              {getFieldDecorator('Socioeconomic')
                (<Select
                  placeholder="Seleccione estrato socioeconomico">
                  <Option value="1">1</Option>
                  <Option value="2">2</Option>
                  <Option value="3">3</Option>
                  <Option value="4">4</Option>
                  <Option value="5">5</Option>
                  <Option value="6">6</Option>
                </Select>)}
            </Item>
          </Col>
          <Col xs={24} md={6}>
            <Item label="Cantidad de dependientes" style={{ marginBottom: '0.3em' }}>
              {getFieldDecorator('Dependent')(<Input />)}
            </Item>
          </Col>
        </Row>
        {/*Fila 10 ---- discapacitados - tipo discapacitado - plan de salud - desc plan salud  */}
        <Row gutter={10}>
          <Col xs={24} md={6}>
            <Item label="Posee Discapacidad" style={{ marginBottom: '0.3em' }}>
              {getFieldDecorator('Disability')
                (<Select
                  placeholder="Indique si posee discapacidad">
                  <Option value={0}>No</Option>
                  <Option value={1}>Si</Option>
                </Select>)}
            </Item>
          </Col>
          <Col xs={24} md={6}>
            <Item label="Tipo Discapacidad" style={{ marginBottom: '0.3em' }}>
              {getFieldDecorator('TypeDisabilityId')
                (<Select
                  placeholder="Seleccione tipo de discapacidad">
                  <Option value="Fisica">Fisica</Option>
                  <Option value="Mental">Mental</Option>
                  <Option value="Cognitiva">Cognitiva</Option>
                </Select>)}
            </Item>
          </Col>
          <Col xs={24} md={6}>
            <Item label="Posee Plan complementario de salud" style={{ marginBottom: '0.3em' }}>
              {getFieldDecorator('ExtraHealthPlan')
                (<Select
                  placeholder="Indique si posee plan complementario de salud">
                  <Option value={0}>No</Option>
                  <Option value={1}>Si</Option>
                </Select>)}
            </Item>
          </Col>
          <Col xs={24} md={6}>
            <Item label="Descripcion plan complementario" style={{ marginBottom: '0.3em' }}>
              {getFieldDecorator('DescriptionExtraHealthPlan')(<Input />)}
            </Item>
          </Col>
        </Row>
        {/*Fila 11 ---- posee visa - tipo visa - hobbies  */}
        <Row gutter={10}>
          <Col xs={24} md={6}>
            <Item label="Posee Visa" style={{ marginBottom: '0.3em' }}>
              {getFieldDecorator('Visa')
                (<Select
                  placeholder="Indique si posee visa">
                  <Option value={0}>No</Option>
                  <Option value={1}>Si</Option>
                </Select>)}
            </Item>
          </Col>
          <Col xs={24} md={6}>
            <Item label="Tipo Visa" style={{ marginBottom: '0.3em' }}>
              {getFieldDecorator('VisaTypeId')
                (<Select
                  placeholder="Seleciona tipo de visa"
                  loading={isLoading}
                  allowClear={true}>
                  {(listGeneral.ListVisaType || []).map(item => {
                    return (
                      <Option key={item.Id} value={item.Id}>{item.Name}</Option>
                    )
                  })}
                </Select>)}
            </Item>
          </Col>
          <Col xs={24} md={12}>
            <Item label="Hobbies" style={{ marginBottom: '0.3em' }}>
              {getFieldDecorator('Hobbie')(<Input />)}
            </Item>
          </Col>
        </Row>

      </Form>
    </Modal>
  )
}

const WrappedPersonalInfoForm = Form.create({
  name: 'profileForm',
  validateMessages: { required: (args) => 'Este campo es obligatorio' },
  mapPropsToFields({ profile }) {
    return {
      Treatment: Form.createFormField({ value: profile.Treatment, }),
      FirstName: Form.createFormField({ value: profile.FirstName, }),
      LastName: Form.createFormField({ value: profile.LastName, }),
      Gender: Form.createFormField({ value: profile.Gender, }),
      TypeDocumentId: Form.createFormField({ value: profile.TypeDocumentId, }),
      Document: Form.createFormField({ value: profile.Document, }),
      BirthDate: Form.createFormField({ value: profile.BirthDate, }),
      BirthCountryId: Form.createFormField({ value: profile.BirthCountryId, }),
      BirthDepartmentId: Form.createFormField({ value: profile.BirthDepartmentId, }),
      BirthCityId: Form.createFormField({ value: profile.BirthCityId, }),
      CountryId: Form.createFormField({ value: profile.CountryId, }),
      DepartmentId: Form.createFormField({ value: profile.DepartmentId, }),
      CityId: Form.createFormField({ value: profile.CityId, }),
      CivilStatus: Form.createFormField({ value: profile.CivilStatus, }),
      Address: Form.createFormField({ value: profile.Address, }),
      Telephone: Form.createFormField({ value: profile.Telephone, }),
      Mobile: Form.createFormField({ value: profile.Mobile, }),
      MobileCompany: Form.createFormField({ value: profile.MobileCompany, }),
      Email: Form.createFormField({ value: profile.Email, }),
      EmailCompany: Form.createFormField({ value: profile.EmailCompany, }),
      Profession: Form.createFormField({ value: profile.Profession, }),
      EducationLevelId: Form.createFormField({ value: profile.EducationLevelId, }),
      RH: Form.createFormField({ value: profile.RH, }),
      BloodTypeId: Form.createFormField({ value: profile.BloodTypeId, }),
      Eps: Form.createFormField({ value: profile.Eps, }),
      Afp: Form.createFormField({ value: profile.Afp, }),
      Cesantias: Form.createFormField({ value: profile.Cesantias, }),
      EthnicityGroupId: Form.createFormField({ value: profile.EthnicityGroupId, }),
      EthnicityId: Form.createFormField({ value: profile.EthnicityId, }),
      Religion: Form.createFormField({ value: profile.Religion, }),
      HousingTypeId: Form.createFormField({ value: profile.HousingTypeId, }),
      ResidentialZone: Form.createFormField({ value: profile.ResidentialZone, }),
      Socioeconomic: Form.createFormField({ value: profile.Socioeconomic, }),
      Dependent: Form.createFormField({ value: profile.Dependent, }),
      Disability: Form.createFormField({ value: profile.Disability, }),
      TypeDisabilityId: Form.createFormField({ value: profile.TypeDisabilityId, }),
      ExtraHealthPlan: Form.createFormField({ value: profile.ExtraHealthPlan, }),
      DescriptionExtraHealthPlan: Form.createFormField({ value: profile.DescriptionExtraHealthPlan, }),
      Visa: Form.createFormField({ value: profile.Visa, }),
      VisaTypeId: Form.createFormField({ value: profile.VisaTypeId, }),
      Hobbie: Form.createFormField({ value: profile.Hobbie, }),
      EthnicityId: Form.createFormField({ value: profile.EthnicityId, }),
      BirthDate: Form.createFormField({ value: moment(profile.BirthDate, 'DD/MM/YYYY') }),
    };
  },
})(ModalGeneral);

export default WrappedPersonalInfoForm
