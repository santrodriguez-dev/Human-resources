import React, { useEffect, useState } from 'react'

//Styles
import './Profile.scss';

//Components
import MainPersonalInfo from './components/main-personal-info/main-personal-info';
import ModalExperience from './components/experience-modal/modal-experience';
import VolunteeringModal from './components/modal-volunteering/modal-volunteering';
import FormalEducationModal from './components/formal-education-modal/formal-education-modal';
import CertificationsModal from './components/certifications-modal/certifications-modal';
import FamilyModal from './components/family-modal/family-modal';
import SocialMediaModal from './components/social-media-modal/social-media-modal';
import LanguageModal from './components/language-modal/language-modal';
import ProjectModal from './components/projects-modal/project-modal';
import PublicationModal from './components/publication-modal/publication-modal';
import ExamModal from './components/exam-modal/exam-modal';
import PatentModal from './components/patent-modal/patent-modal';
import GeneralModal from './components/modal-general/modal-general';
import SkillModal from './components/skill-modal/skill-modal';
import ListCards from './components/list-cards/ListCards';

//Services
import { ProfileService } from "./services/ProfileService";
import { message } from 'antd';

// enums
import { TypeListEnum } from "./enums/TypeList";

// Lazy Loading Imports
// const ModalExperience = React.lazy(() =>
//   import('./components/experience-modal/modal-experience')
// )

const Profile = (props) => {

  const { location } = props

  const [loadingState, setLoadingState] = useState(true);
  const [typeDetails, setTypeDetails] = useState({});
  const [experienceModalVisible, setExperienceModalVisible] = useState(false);
  const [formalEducationModalVisible, setFormalEducationModalVisible] = useState(false);
  const [certificationsModalVisible, setCertificationsModalVisible] = useState(false);
  const [volunteeringModalVisible, setVolunteeringModalVisible] = useState(false);
  const [familyModalVisible, setFamilyModalVisible] = useState(false);
  const [socialMediaModalVisible, setSocialMediaModalVisible] = useState(false);
  const [languageModalVisible, setLanguageModalVisible] = useState(false);
  const [projectModalVisible, setProjectModalVisible] = useState(false);
  const [publicationModalVisible, setPublicationModalVisible] = useState(false);
  const [examModalVisible, setExamModalVisible] = useState(false);
  const [patentModalVisible, setPatentModalVisible] = useState(false);
  const [generalModalVisible, setGeneralModalVisible] = useState(false);
  const [skillModalVisible, setSkillModalVisible] = useState(false);
  const [itemTemp, setItemTemp] = useState(null);
  const [profile, setProfile] = useState({})

  useEffect(() => {
    const queryParams = location.search
    const params = JSON.parse('{"' + decodeURI(queryParams.substring(1)).replace(/"/g, '\\"').replace(/&/g, '","').replace(/=/g, '":"') + '"}')
    getProfile(params.code)
  }, []);

  const getProfile = (id) => {
    setLoadingState(true)

    ProfileService.getProfileById(id)
      .then(response => {

        setLoadingState(false)
        if (!response) {
          message.error('No se ha encontrado el perfil', 4)
          return
        }
        setProfile(response)
      })
  }

  const deleteItemByList = (paramListName, index) => {

    // 1. Cambiar estado de item eliminado (Status=0)
    const listUpdated = profile[paramListName].map((item, i) => {
      if (i === index) return { ...item, Status: 0 }
      return item
    })
    //Discrimina las demas listas
    let newObjProfile = { ModificationUser: 'sabrinas' }
    for (const key in profile) {
      if (typeof profile[key] === 'object' && key !== paramListName) continue
      if (key === paramListName) {
        newObjProfile = { ...newObjProfile, [key]: listUpdated }
        continue
      }
      newObjProfile = {
        ...newObjProfile,
        [key]: profile[key]
      }
    }
    // 2. Enviar a base de datos

    return ProfileService.updateProfile(newObjProfile).then(response => {
      if (!response) {
        message.error('No se ha podido guardar la información', 4);
        return null
      }

      // 3. Actualizar estado global
      // Actualizar listas de objeto principal
      setProfile({
        ...profile,
        [paramListName]: profile[paramListName].filter((item, i) => index !== i)
      })
      return true
    })
  }

  const updateItemByList = (paramListName, itemModified, editableMode) => {
    if (!profile[paramListName]) {
      console.error('No existe una propiedad con el nombre: ' + paramListName);
      return null
    }

    let listUpdated = null
    if (editableMode) {
      listUpdated = profile[paramListName].map(item => {
        if (item.Id === itemModified.Id) return { ...item, ...itemModified }
        return item
      })

    } else {
      listUpdated = [...profile[paramListName], itemModified]
    }

    //Discrimina las demas listas
    let newObjProfile = {}
    for (const key in profile) {
      if (typeof profile[key] === 'object' && key !== paramListName) continue
      if (key === paramListName) {
        newObjProfile = { ...newObjProfile, [key]: listUpdated }
        continue
      }
      newObjProfile = { ...newObjProfile, [key]: profile[key] }
    }

    // console.log(newObjProfile);
    return ProfileService.updateProfile({ ...newObjProfile, ModificationUser: 'sabrinas' })
      .then(response => {
        if (!response) {
          message.error('No se ha podido guardar la información', 4);
          return null
        }
        message.success('La información se ha guardado satisfactoriamente', 4);
        setProfile({ ...profile, ...newObjProfile })
        return true
      })
  }

  const openModalByType = (typeItem, item) => {
    // En caso de que se vaya a modificar la informacion
    if (item) setItemTemp(item)

    switch (typeItem) {
      case TypeListEnum.ProfesionalExperience:
        setExperienceModalVisible(true)
        break;
      case TypeListEnum.FormalEducation:
        setFormalEducationModalVisible(true)
        break;
      case TypeListEnum.Certifications:
        setCertificationsModalVisible(true)
        break;
      case TypeListEnum.Volunteering:
        setVolunteeringModalVisible(true)
        break;
      case TypeListEnum.FamilyInformation:
        setFamilyModalVisible(true)
        break;
      case TypeListEnum.SocialNetworks:
        setSocialMediaModalVisible(true)
        break;
      case TypeListEnum.Languages:
        setLanguageModalVisible(true)
        break;
      case TypeListEnum.Projects:
        setProjectModalVisible(true)
        break;
      case TypeListEnum.Publications:
        setPublicationModalVisible(true)
        break;
      case TypeListEnum.Exams:
        setExamModalVisible(true)
        break;
      case TypeListEnum.Patents:
        setPatentModalVisible(true)
        break;
      case TypeListEnum.Skill:
        setSkillModalVisible(true)
        break;
      case 'general':
        setGeneralModalVisible(true)
        break;

      default:
        break;
    }
  }

  const closeModals = e => {
    setExperienceModalVisible(false);
    setFormalEducationModalVisible(false);
    setCertificationsModalVisible(false);
    setVolunteeringModalVisible(false);
    setFamilyModalVisible(false);
    setSocialMediaModalVisible(false);
    setLanguageModalVisible(false)
    setProjectModalVisible(false)
    setPublicationModalVisible(false)
    setExamModalVisible(false)
    setPatentModalVisible(false)
    setGeneralModalVisible(false)
    setSkillModalVisible(false)
    setItemTemp(null)
  }

  return (
    <React.Fragment>

      <div className="Profile__container">
        <div className="profile__Personal-info" >
          {profile ?
            <MainPersonalInfo
              profile={profile}
              loading={loadingState}
              skills={profile.ListSkill}
              setProfile={setProfile}
              openModal={() => openModalByType('general')} />
            : null}
        </div>

        <div className="profile__mainContainer">

          {/* Experiencia profesional */}
          <ListCards
            list={profile.ListProfessionalExperience}
            typeList={0}
            loading={loadingState}
            iconDefault="reconciliation"
            onAddItem={openModalByType}
            onEditItem={openModalByType}
            deleteItemByList={(index) => deleteItemByList('ListProfessionalExperience', index)} />

          {/* Educacion formal */}
          <ListCards
            list={profile.ListSchooling}
            typeList={1}
            loading={loadingState}
            iconDefault="read"
            onAddItem={openModalByType}
            onEditItem={openModalByType}
            deleteItemByList={(index) => deleteItemByList('ListSchooling', index)} />

          {/* Certificaciones */}
          <ListCards
            list={profile.ListCertification}
            typeList={2}
            loading={loadingState}
            iconDefault="solution"
            onAddItem={openModalByType}
            onEditItem={openModalByType}
            deleteItemByList={(index) => deleteItemByList('ListCertification', index)} />

          {/* Voluntariado */}
          <ListCards
            list={profile.ListVolunteering}
            typeList={3}
            loading={loadingState}
            iconDefault="fire"
            onAddItem={openModalByType}
            onEditItem={openModalByType}
            deleteItemByList={(index) => deleteItemByList('ListVolunteering', index)} />

          {/* Información Familiar */}
          <ListCards
            list={profile.ListFamilyMember}
            typeList={4}
            loading={loadingState}
            iconDefault="team"
            onAddItem={openModalByType}
            onEditItem={openModalByType}
            deleteItemByList={(index) => deleteItemByList('ListFamilyMember', index)} />

          {/* Redes Sociales */}
          <ListCards
            list={profile.ListSocialMedia}
            typeList={5}
            loading={loadingState}
            iconDefault="global"
            onAddItem={openModalByType}
            onEditItem={openModalByType}
            deleteItemByList={(index) => deleteItemByList('ListSocialMedia', index)} />

          {/* Idiomas */}
          <ListCards
            list={profile.ListLanguage}
            typeList={6}
            loading={loadingState}
            iconDefault="zhihu"
            onAddItem={openModalByType}
            onEditItem={openModalByType}
            deleteItemByList={(index) => deleteItemByList('ListLanguage', index)} />

          {/* Proyectos */}
          <ListCards
            list={profile.ListProject}
            typeList={7}
            loading={loadingState}
            iconDefault="line-chart"
            onAddItem={openModalByType}
            onEditItem={openModalByType}
            deleteItemByList={(index) => deleteItemByList('ListProject', index)} />

          {/* Publicaciones */}
          <ListCards
            list={profile.ListPublications}
            typeList={8}
            loading={loadingState}
            iconDefault="book"
            onAddItem={openModalByType}
            onEditItem={openModalByType}
            deleteItemByList={(index) => deleteItemByList('ListPublications', index)} />

          {/* Examenes */}
          <ListCards
            list={profile.ListTest}
            typeList={9}
            loading={loadingState}
            iconDefault="form"
            onAddItem={openModalByType}
            onEditItem={openModalByType}
            deleteItemByList={(index) => deleteItemByList('ListTest', index)} />

          {/* Patentes */}
          <ListCards
            list={profile.ListPatents}
            typeList={10}
            loading={loadingState}
            iconDefault="search"
            onAddItem={openModalByType}
            onEditItem={openModalByType}
            deleteItemByList={(index) => deleteItemByList('ListPatents', index)} />
        </div>
      </div>

      <GeneralModal
        visible={generalModalVisible}
        profile={profile}
        closeModal={closeModals}
        profile={profile}
        setProfile={setProfile}
        setProfile={setProfile}
      />

      <SkillModal
        visible={skillModalVisible}
        profile={profile}
        closeModal={closeModals}
      />

      <ModalExperience
        visible={experienceModalVisible}
        closeModalExperience={closeModals}
        experienceData={itemTemp}
        updateItem={(item, editableMode) => updateItemByList('ListProfessionalExperience', item, editableMode)}
      />

      <ModalExperience
        visible={experienceModalVisible}
        closeModalExperience={closeModals}
        experienceData={itemTemp}
        updateItem={(item, editableMode) => updateItemByList('ListProfessionalExperience', item, editableMode)}
      />
      <FormalEducationModal
        visible={formalEducationModalVisible}
        closeModalExperience={closeModals}
        data={itemTemp}
        typeDetails={typeDetails}
        setTypeDetails={setTypeDetails}
        updateItem={(item, editableMode) => updateItemByList('ListSchooling', item, editableMode)}
      />
      <CertificationsModal
        visible={certificationsModalVisible}
        closeModal={closeModals}
        data={itemTemp}
        updateItem={(item, editableMode) => updateItemByList('ListCertification', item, editableMode)}
      />
      <VolunteeringModal
        visible={volunteeringModalVisible}
        closeModal={closeModals}
        data={itemTemp}
        updateItem={(item, editableMode) => updateItemByList('ListVolunteering', item, editableMode)}
      />
      <FamilyModal
        visible={familyModalVisible}
        closeModal={closeModals}
        data={itemTemp}
        updateItem={(item, editableMode) => updateItemByList('ListFamilyMember', item, editableMode)}
      />
      <SocialMediaModal
        visible={socialMediaModalVisible}
        closeModal={closeModals}
        data={itemTemp}
        updateItem={(item, editableMode) => updateItemByList('ListSocialMedia', item, editableMode)}
      />
      <LanguageModal
        visible={languageModalVisible}
        closeModal={closeModals}
        data={itemTemp}
        typeDetails={typeDetails}
        setTypeDetails={setTypeDetails}
        updateItem={(item, editableMode) => updateItemByList('ListLanguage', item, editableMode)}
      />
      <ProjectModal
        visible={projectModalVisible}
        closeModal={closeModals}
        data={itemTemp}
        updateItem={(item, editableMode) => updateItemByList('ListProject', item, editableMode)}
      />
      <PublicationModal
        visible={publicationModalVisible}
        closeModal={closeModals}
        data={itemTemp}
        updateItem={(item, editableMode) => updateItemByList('ListPublications', item, editableMode)}
      />
      <ExamModal
        visible={examModalVisible}
        closeModal={closeModals}
        data={itemTemp}
        updateItem={(item, editableMode) => updateItemByList('ListTest', item, editableMode)}
      />
      <PatentModal
        visible={patentModalVisible}
        closeModal={closeModals}
        data={itemTemp}
        updateItem={(item, editableMode) => updateItemByList('ListPatents', item, editableMode)}
      />
    </React.Fragment >
  );
}

export default Profile
