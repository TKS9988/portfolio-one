import React, { useEffect, useState, useRef } from 'react';
import CheckIcon from '@mui/icons-material/Check';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import Styles from '../../../pages/dashboard/Dashboard.module.scss';
import { storage, db } from '../../../firebase/clientApp';
// import { CategoryData } from '../../../types/Types';
// type Props = {
//   newCategoryName: string;
//   createCategoryName: string;
//   closeBtn:any;
//   productIdLst:any[]
// }

// [import list]
// setShowCategory
// setRegisterLoading
// createCategoryNameRef

type CategoryData = {
    name: string;
    orderBy: number;
    categoryId: string;
  }

type Props = {
    categoryData: CategoryData[];
}


const Category: React.FC<Props> = (props) => {

    // const categoryData = props.categoryData;

    // const [showSelect, setShowSelect] = useState(true);
    // const [showEditCategory, setShowEditCategory] = useState(false);
    // const [showChoiceCategory, setShowChoiceCategory] = useState(false);
    // const [showCreateCategory, setShowCreateCategory] = useState(false);
    // const [showEdit, setShowEdit] = useState(false);
    // const [showCreateBx, setShowCreateBx] = useState(false);

    // const [validate, setValidate] = useState(false);

    // const editCategoryNameRef = useRef<HTMLInputElement>(null);
    // const [editCategoryName, setEditCategoryName] = useState<string>("");
    // const [newCategoryName, setNewCategoryName] = useState<string>("");
    // const [editCategoryId, setEditCategoryId] = useState<string>("");
    // const createCategoryNameRef = useRef<HTMLInputElement>(null);
    // const [createCategoryName, setCreateCategoryName] = useState<string>("");
    // const [deleteConfirmationBx, setDeleteConfirmationBx] = useState(false);
    // const [completeDeleteCategory, setCompleteDeleteCategory] = useState(false);

    // const closeBtn = () => {
    //     setCreateCategoryName("");
    //     setEditCategoryName("");
    //     setEditCategoryId("");
    //     setShowCategory(false);
    //     setShowEdit(false);
    //     setShowChoiceCategory(false);
    //     setShowEditCategory(false);
    //     setRegisterCategoryComplete(false);
    //     setShowCreateBx(false);
    //     setShowCreateCategory(false);
    //     setShowSelect(true);
    //     setValidate(false);
    //     setCompleteDeleteCategory(false)
    // }
    // const backEditCategoryDetail = () => {
    //     setShowCategory(true);
    //     setShowSelect(false);
    //     setShowEditCategory(true);
    //     setShowChoiceCategory(false);
    //     setShowCreateCategory(false);
    //     setShowEdit(true);
    //     setShowCreateBx(false)
    //     setDeleteConfirmationBx(false);
    //   }

    // const Select = () => {
    //     return (
    //         <div className={Styles.inner}>
    //         <h3>Category</h3>
    //         <p>which do you do?</p>
    //         <div className={Styles.ovf}>
    //             <div className={Styles.left} onClick={() => { setShowSelect(false); setShowEditCategory(true); setShowChoiceCategory(true) }}>edit</div>
    //             <div className={Styles.right} onClick={() => { setShowSelect(false); setShowCreateCategory(true); setShowCreateBx(true); }}>create</div>
    //         </div>
    //           <p className={Styles.close} onClick={() => { setShowCategory(false); setShowSelect(true); setShowEditCategory(false); setShowChoiceCategory(false)}}>close</p>
    //       </div>
    //       )
    // }

    // const validateTxt = () => {
    //     return <p className={Styles.validation}>Please enter a category name.</p>
    //   }
    
    // const CreateCategory = () => {
    //     const addCategory = async () => {
    //       const name = createCategoryNameRef.current.value;
    //       const data = { orderBy: "", name: name };
    //       if(name === ""){
    //         setValidate(true);
    //         return;
    //       } else {
    //         setShowCategory(false)
    //         setRegisterLoading(true);
    //         setShowCreateBx(false)
    //         await addDoc(collection(db, "category"), data).then(() => {
    //           setRegisterLoading(false);
    //           setCreateCategoryName(name);
    //           setRegisterCategoryComplete(true);
    //           setShowSelect(true);
    //           setShowCreateCategory(false)
    //         }).catch(() => {
    //           console.log('error')
    //         })
    //       }
    //     }
    //     const CreateBx = () => {
    //       return (
    //         <>
    //           <div className={Styles.inputCategoryEditBx}>
    //             <input ref={createCategoryNameRef} placeholder="Category Name" type="text" />
    //             {validate ? <>{validateTxt()}</> : <></>}
    //             <button onClick={() => addCategory()}>Register</button>
    //           </div>
    //           <p className={Styles.close} onClick={closeBtn}>close</p>
    //         </>
    //       )
    //     }
    //     return (
    //       <div className={Styles.inner}>
    //         <h3>Create Category</h3>
    //         {showCreateBx ? <CreateBx /> : <></>}
    //       </div>
    //     )
    //   }

    //   const EditCategory = () => {
    //     const handleClick = (name:string,id:string) => {
    //       setEditCategoryName(name);
    //       setEditCategoryId(id);
    //       setShowEdit(true);
    //       setShowChoiceCategory(false); 
    //     }
    
    //     const editCategory = (e:any) => {
    //       e.preventDefault()
    //       setShowCategory(false);
    //       setRegisterLoading(true);
    //       const categoryName = editCategoryNameRef.current.value;
    //       setNewCategoryName(categoryName)
    //       if (categoryName === '') {
    //         alert('Please enter Category Name.');
    //         setRegisterLoading(false);
    //       } else {
    //         const editRegisterRef = doc(db, 'category', editCategoryId);
    //         updateDoc(editRegisterRef, {
    //           name: categoryName,
    //         }).then(async () => {
    //           for (let i = 0; i < productIdLst.length; i++){
    //             const changeProductCategoryRef = doc(db, "menu", productIdLst[i]);
    //             await updateDoc(changeProductCategoryRef, {
    //               category: categoryName
    //             })
    //             if (i === productIdLst.length - 1) {
    //               setRegisterLoading(false);
    //               setRegisterCategoryComplete(true);
    //             }
    //           }
    //         }).catch((error) => {
    //           alert(`update failed (${error})`);
    //           setRegisterLoading(false);
    //         }); 
    //       }
    //     }
    
    //     const Edit = () => {
    //       return (
    //         <div className={Styles.inputCategoryEditBx}>
    //           <input ref={editCategoryNameRef} placeholder="Category Name" type="text" defaultValue={editCategoryName} />
    //           <div className={Styles.ovf}>
    //             <button className={Styles.left} onClick={() => { setDeleteConfirmationBx(true); setShowEdit(false); setShowEditCategory(false); }}>Delete</button>
    //             <button className={Styles.right} onClick={editCategory}>Register</button>
    //           </div>
    //       </div>
    //       )
    //       }
          
    //     return (
    //       <div className={Styles.inner}>
    //       <h3>Edit Category</h3>
    //         <p>which one do you want to edit?</p>
    //         {showChoiceCategory ?
    //           <ul className={Styles.ovf}>
    //             {categoryData.length > 0 ?
    //               <>
    //                 {categoryData.map((list, index) => (
    //                   <li key={index} onClick={() => handleClick(list.name, list.categoryId)}><span className={Styles.moveIcon}><OpenWithIcon /></span>{list.name}</li>
    //                 ))}
    //               </> :
    //               <p>No categories...</p>
    //             }
    //           </ul>
    //           : showEdit ?
    //             <Edit />
    //           : <></>
    //         }
    //         <p className={Styles.close} onClick={() => { setShowCategory(false); setShowSelect(true); setShowEditCategory(false); setRegisterLoading(false);}}>close</p>
    //     </div>
    //     )
    // }
    
    // const deleteCategory = async () => {
    //     await deleteDoc(doc(db, "category", editCategoryId)).then(() => {
    //       setDeleteConfirmationBx(false)
    //       setCompleteDeleteCategory(true);
    //     }).catch(() => {
    //       console.log('error');
    //     })
    // }
    

    //   const DeleteConfirmation = () => {
    //     return (
    //       <div className={Styles.deleteConfirmation}>
    //         <span><DeleteForeverIcon /></span>
    //         <h3>Are you sure you want to delete {editCategoryName}?</h3>
    //         <p>You will not be able to display the products registered on {editCategoryName}.</p>
    //         <div className={Styles.ovf}>
    //           <div className={Styles.left} onClick={() => backEditCategoryDetail()}>Cancel</div>
    //           <div className={Styles.right} onClick={() => deleteCategory()}>Delete</div>
    //         </div>
    //       </div>
    //     )
    // }
    
    // const DeleteComplete = () => {
    //   return (
    //     <div className={Styles.inner}>
    //       <h3>Delete Complete!</h3>
    //       <p>{categoryName}</p>
    //       <p className={Styles.close} onClick={closeBtn}>close</p>
    //     </div>
    //   )
    // }

    return (
        <div className={Styles.categoryCreateBx}>
          {/* {showSelect ? <Select /> : <></>}
          {showEditCategory ? <EditCategory /> : <></>}
          {showCreateCategory ? <CreateCategory /> : <></>}
          {deleteConfirmationBx ? <DeleteConfirmation /> : <></>}
          {completeDeleteCategory ? <DeleteComplete /> : <></>} */}
        </div>
      )
}
export default Category;