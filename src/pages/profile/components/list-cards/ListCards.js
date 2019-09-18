import React, { Fragment, useState, useEffect } from 'react';
import ItemCard from "../item-card/item-card";
import { Button, Collapse, Icon, Modal, message, Badge } from 'antd';


import styles from "./ListCards.module.scss";
import { TypeList } from "../../enums/TypeList";

const { Panel } = Collapse;
const { confirm } = Modal;


const ListCards = ({ loading, list = [], typeList, iconDefault, onAddItem, onEditItem, deleteItemByList }) => {

	const [listState, setListstate] = useState([])

	useEffect(() => {
		if (!list) return
		setListstate(list)
	}, [list])

	const onDeleteItem = (item, index) => {
		confirm({
			title: '¿Desea eliminar este registro?',
			okText: 'Confirmar',
			cancelText: 'Cancelar',
			centered: true,
			okType: 'danger',
			confirmLoading: true,
			onOk() {
				return new Promise((resolve, reject) => {
					deleteItemByList(index).then(resp => {
						if (resp) resolve()
					})
				}).catch(() => console.log('Oops errors!'));
			},
			onCancel() { },
		});
	}

	const selectItemCard = (item, index) => {
		switch (TypeList[typeList]) {
			case TypeList[0]:
				return (
					<ItemCard
						image={iconDefault}
						field1={item.Position}
						field2={item.CompanyName}
						field3={item.Location}
						field4={`${item.StartDate} - ${item.EndDate}`}
						field5={item.Functions}
						onDeleteItem={() => onDeleteItem(item, index)}
						onEditItem={() => onEditItem(typeList, item)}
					/>
				)
			case TypeList[1]:
				return (
					<ItemCard
						image={iconDefault}
						field1={item.Title}
						field2={item.InstitutionName}
						field3={item.CulminationYear}
						field4={`Promedio : ${item.Average}`}
						field5={item.StudyFieldDescription}
						onDeleteItem={() => onDeleteItem(item, index)}
						onEditItem={() => onEditItem(typeList, item)}
					/>
				)
			case TypeList[2]:
				return (
					<ItemCard
						image={iconDefault}
						field1={item.Name}
						field2={item.Entity}
						field3={`${item.EmissionDate} - ${item.ExpirationDate}`}
						field4={`Credencial : ${item.CredentialID}`}
						field5={`URL de la credencial : ${item.CredentialURL}`}
						onDeleteItem={() => onDeleteItem(item, index)}
						onEditItem={() => onEditItem(typeList, item)}
					/>
				)
			case TypeList[3]:
				return (
					<ItemCard
						image={iconDefault}
						field1={item.Role}
						field2={item.Organization}
						field3={item.Cause}
						field4={`${item.StartDate} - ${item.EndDate || "Actualmente"}`}
						onDeleteItem={() => onDeleteItem(item, index)}
						onEditItem={() => onEditItem(typeList, item)}
					/>
				)
			case TypeList[4]:
				return (
					<ItemCard
						image={iconDefault}
						field1={`${item.Name} ${item.LastName}`}
						field2={item.FamilyTypeDescription}
						field3={`${item.TypeDocumentDescription} - ${item.Document}`}
						onDeleteItem={() => onDeleteItem(item, index)}
						onEditItem={() => onEditItem(typeList, item)}
					/>
				)
			case TypeList[5]:
				return (
					<ItemCard
						image={iconDefault}
						field1={item.TypeId}
						field2={item.URL}
						onDeleteItem={() => onDeleteItem(item, index)}
						onEditItem={() => onEditItem(typeList, item)}
					/>
				)
			case TypeList[6]:
				return (
					<ItemCard
						image={iconDefault}
						field1={item.LanguageId}
						field2={item.DomainLevel}
						onDeleteItem={() => onDeleteItem(item, index)}
						onEditItem={() => onEditItem(typeList, item)}
					/>
				)
			case TypeList[7]:
				return (
					<ItemCard
						image={iconDefault}
						field1={item.Title}
						field2={item.Theme}
						field3={item.Entity}
						field4={`${item.StartDate} - ${item.FinishDate || "Actualmente"}`}
						onDeleteItem={() => onDeleteItem(item, index)}
						onEditItem={() => onEditItem(typeList, item)}
					/>
				)
			case TypeList[8]:
				return (
					<ItemCard
						image={iconDefault}
						field1={item.Title}
						field2={item.Theme}
						field3={item.Entity}
						field4={`Fecha de emisión : ${item.EmissionDate} `}
						field5={`URL de la publicación : ${item.PatentURL}`}
						onDeleteItem={() => onDeleteItem(item, index)}
						onEditItem={() => onEditItem(typeList, item)}
					/>
				)
			case TypeList[9]:
				return (
					<ItemCard
						image={iconDefault}
						field1={item.Title}
						field2={item.Theme}
						field3={item.Entity}
						field4={`Fecha de emisión : ${item.EmissionDate} `}
						field5={`Puntuación : ${item.Punctuation}`}
						onDeleteItem={() => onDeleteItem(item, index)}
						onEditItem={() => onEditItem(typeList, item)}
					/>
				)
			case TypeList[10]:
				return (
					<ItemCard
						image={iconDefault}
						field1={item.Title}
						field2={item.Theme}
						field3={`${item.Entity} - ${item.Office}`}
						field4={`Fecha de emisión : ${item.EmissionDate} `}
						field5={`Numero de la patente : ${item.PatentNumber}`}
						field6={`URL de la patente : ${item.PatentURL}`}
						field7={`Estado : ${item.State}`}
						onDeleteItem={() => onDeleteItem(item, index)}
						onEditItem={() => onEditItem(typeList, item)}
					/>
				)
			default:
				break;
		}
	}

	const genExtra = () => (
		<Badge dot={listState.length === 0}>
			<Icon
				type={loading ? 'loading' : iconDefault}
				onClick={event => {
					// If you don't want click extra trigger collapse, you can prevent this:
					event.stopPropagation();
				}}
			/>
		</Badge>
	);


	return (
		<Collapse
			accordion
			style={{ marginBottom: '14px' }}
			className={styles.margin}>
			<Panel
				header={TypeList[typeList]}
				key="1"
				extra={genExtra()}>
				<div className={styles.add_button}>
					<h4></h4>
					<Button type="primary" shape="circle" icon="plus" size="small" onClick={() => onAddItem(typeList)} />
				</div>
				{(listState.length === 0) ?
					<h4>No hay información para mostrar</h4> : null}
				<div className={styles.list_experiences}>
					{listState.map((item, i) =>
						(<Fragment key={i}>{selectItemCard(item, i)}</Fragment>)
					)}
				</div>

			</Panel>

		</Collapse>
	);
}

export default ListCards;
