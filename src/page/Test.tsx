import React, {useState} from 'react';
import {PlusOutlined} from '@ant-design/icons';
import {Image, Upload, message, Button} from 'antd';
import type {GetProp, UploadFile, UploadProps} from 'antd';

type FileType = Parameters<GetProp<UploadProps, 'beforeUpload'>>[0];

const getBase64 = (file: FileType): Promise<string> =>
    new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = (error) => reject(error);
    });

const App: React.FC = () => {
    const [previewOpen, setPreviewOpen] = useState(false);
    const [previewImage, setPreviewImage] = useState('');
    const [fileList, setFileList] = useState<UploadFile[]>([
        {
            uid: '0',
            name: 'image.png',
            status: 'done',
            url: 'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png',
        }
    ]);

    const props: UploadProps = {
        beforeUpload: (file) => {
            setFileList([...fileList, file]);

            return false;
        },
        fileList,
    };

    const handlePreview = async (file: UploadFile) => {
        if (!file.url && !file.preview) {
            file.preview = await getBase64(file.originFileObj as FileType);
        }

        setPreviewImage(file.url || (file.preview as string));
        setPreviewOpen(true);
    };

    const handleChange: UploadProps['onChange'] = ({fileList: newFileList}) => {
        setFileList(newFileList);
    }
    const handleUpload = () => {
        const file = fileList[0]
    };

    const uploadButton = (
        <button style={{border: 0, background: 'none'}} type="button">
            <PlusOutlined/>
            <div style={{marginTop: 8}}>Tải lên</div>
        </button>
    );
    return (
        <>
            <Upload {...props}
                    listType="picture-circle"
                    fileList={fileList}
                    onPreview={handlePreview}
                    onChange={handleChange}
                    style={{width: 250}}
            >
                {fileList.length >= 1 ? null : uploadButton}
            </Upload>
            <Button
                type="primary"
                onClick={handleUpload}
                disabled={fileList.length === 0}

                style={{marginTop: 16}}
            >
                Upload
            </Button>
            {previewImage && (
                <Image
                    wrapperStyle={{display: 'none'}}
                    preview={{
                        visible: previewOpen,
                        onVisibleChange: (visible) => setPreviewOpen(visible),
                        afterOpenChange: (visible) => !visible && setPreviewImage(''),
                    }}
                    src={previewImage}
                />
            )}
        </>
    );
};

export default App;