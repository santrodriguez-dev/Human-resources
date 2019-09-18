import React, { Fragment } from 'react'
import './main-personal-info2.scss'

import { Button, Card, Rate, Icon } from 'antd';

const MainPersonalInfo = ({ loading, profile, skills = [], openModal }) => {

  return (
    <React.Fragment>
      <Card loading={loading} className="card__profile">
        <div className="card__container">
          <div className="section__card">
            <div className="avatar">
              <img className="image-profile" src={profile.Photo || "https://linksys.i.lithium.com/t5/image/serverpage/image-id/17360i094A9CC74F39EE12/image-size/original?v=1.0&px=-1"} alt="" />
            </div>
          </div>
          <strong className="section__card">{profile.FirstName} {profile.LastName}</strong>

          <div className="section__card">
            <Icon type="shopping" style={{ fontSize: '2em' }} />
            <span>{profile.Profession}</span>
            <br />
            <Icon type="mail" style={{ fontSize: '2em' }} />
            <span>{profile.EmailCompany}</span>
            <span>{profile.Email}</span>
            <br />
            <Icon type="phone" style={{ fontSize: '2em' }} />
            <span>{profile.Mobile}</span>
            <span>{`Celular de la compañia : ${profile.MobileCompany} `}</span>
            <br />
            <img src="https://cdn4.iconfinder.com/data/icons/seo-web-outline-1/100/seo__web_outline_1_4-512.png" alt="" className="image_local" />
            <span>{profile.Address}</span>
            <span>{profile.CityDescription}</span>
          </div>

          <div className="section__card">
            <div>
              <Button type="primary" onClick={openModal}>Ver mas</Button>
            </div>
          </div>
        </div>
      </Card>

      <Card
        loading={loading}
        style={{ marginTop: '14px' }}>
        <div className="card__container">
          <strong className="section__card">Habilidades</strong>
          <div className="section__card">

            {skills.map((skill, i) => (
              <Fragment key={i}>
                <span>{skill.NameDescription}</span>
                <Rate value={skill.Punctuation} character={<Icon type="check-circle" />} style={{ color: '#1890ff' }} allowHalf />
              </Fragment>
            ))}

            {/* <span>Trabajo en equipo</span>
            <Rate style={{ color: '#1890ff' }} character={<Icon type="check-circle" />} allowHalf />
            <span>Comunicación</span>
            <Rate style={{ color: '#1890ff' }} character={<Icon type="check-circle" />} allowHalf />
            <span>Creatividad</span>
            <Rate style={{ color: '#1890ff' }} character={<Icon type="check-circle" />} allowHalf /> */}
          </div>
        </div>
      </Card>

    </React.Fragment>

  )
}

export default MainPersonalInfo
