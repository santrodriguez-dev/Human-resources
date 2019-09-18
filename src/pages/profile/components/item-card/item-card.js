import React from 'react'
// import { Link } from 'react-router-dom'
import { Divider, Icon } from 'antd';

import styles from "./item-card.module.scss";


const Experience = (props) => {

  const { image, field1, field2, field3, field4, field5, field6, field7, onDeleteItem, onEditItem } = props

  return (
    <div className={styles.experience}>
      <div className={styles.image_experience}>
        {/*<img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRctnhpuJmvY93hep5sGljelKVOmQueHyidhqLb8_ueCj0J9T5J-Q" alt="" />*/}
        <Icon type={image} style={{ fontSize: '5em' }} />
      </div>
      <div className={styles.experience_info}>
        <div className={styles.container_info}>
          <div className={styles.first_panel} style={{ display: 'table-cell', width: '40%' }}>
            <span>{field1}</span>
            <br />
            <span href="/">{field2}</span>
            <br />
            <span>{field3}</span>
            <br />
            <span>{field4}</span>
          </div>
          <div style={{ display: 'table-cell' }}>
            <span>{field5}</span>
            <br />
            <span>{field6}</span>
            <br />
            <span>{field7}</span>
          </div>
        </div>
        <div className={styles.second_panel}>
          <div className={styles.icons}>
            <Icon type="delete" onClick={onDeleteItem} />
            <Icon type="edit" onClick={onEditItem} />
          </div>
          <Divider style={{ margin: '4px 0 0 0' }} />
        </div>
      </div>
    </div>
  )
}

export default Experience
