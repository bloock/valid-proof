import React, { useMemo } from 'react';
import 'primereact/resources/themes/saga-blue/theme.css';
import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import {useDropzone} from 'react-dropzone';
import '../customstyles.css';

const baseStyle = {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: '20px',
    borderWidth: 2,
    borderRadius: 2,
    backgroundColor: '#fafafa',
    color: '#bdbdbd',
    outline: 'none',
    transition: 'border .24s ease-in-out',
    height: '250px'
  };
  
  const activeStyle = {
    borderColor: '#2196f3'
  };
  
  const acceptStyle = {
    borderColor: '#00e676'
  };
  
  const rejectStyle = {
    borderColor: '#ff1744'
  }

const TextValidation = (props) => {

    const {
        isDragActive,
        isDragAccept,
        isDragReject
    } = useDropzone({accept: 'image/*'});

    const style = useMemo(() => ({
        ...baseStyle,
        ...(isDragActive ? activeStyle : {}),
        ...(isDragAccept ? acceptStyle : {}),
        ...(isDragReject ? rejectStyle : {})
      }), [
        isDragActive,
        isDragReject,
        isDragAccept
    ]);

    const {/*acceptedFiles,*/ getRootProps, getInputProps} = useDropzone();
  
    /*const files = acceptedFiles.map(file => (
        <li key={file.path}>
        {file.path} - {file.size} bytes
        </li>
    ));
    */

    return(
        <section>
            <div className='container' {...getRootProps({style})}>
              <div className='vertical-center horizontal-center'>
                <input {...getInputProps()} />
                <p className='line black-text bold-text'>Drag and drop your file</p>
                <p className='line black-text'>or</p> 
                <p className='button line'>Select file</p>
              </div>
            </div>
        </section>
    )
}

export default TextValidation;