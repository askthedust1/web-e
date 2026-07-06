import { CSSProperties, FC, useEffect, useState } from 'react'
import s from './ck-downlound-files.module.scss'
import { FileUploader } from 'react-drag-drop-files'
import Icon from 'components/Icon'
import clsx from 'clsx'
import {
  FieldError,
  FieldErrorsImpl,
  Merge,
} from 'react-hook-form'
import { useTranslation } from 'next-i18next'
import { store } from 'store'

interface FileProps {
  id: number
  file: string
  name: string
}

function formatFileSize(bytes: number, decimalPoint: number) {
  if (bytes == 0) return '0 Bytes'
  var k = 1000,
    dm = decimalPoint || 2,
    sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'],
    i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i]
}

export const convertFiles: any = async (fileUrls: FileProps[]) => {
  return await Promise?.all(
    fileUrls?.map(item => {
      return new Promise((resolve, reject) => {
        const xhr: any = new XMLHttpRequest();
        xhr.open('GET', item?.file);
        xhr.responseType = 'blob';

        xhr.onload = function () {
          const downloadedFile: any = new File([xhr.response], item.name, { type: xhr.getResponseHeader('Content-Type') });
          resolve(downloadedFile)
        };

        xhr.onerror = (error: any) => {
          reject(error)
        }
        xhr.send();
      })
    })
  )
}

const fileTypes = ['JPG', 'PNG', 'DOC', 'DOCX', 'PDF', 'ZIP', 'XLSX', 'XLS']

export function truncateFilename(filename: string, maxLength = 85): string {
  const dotIndex = filename.lastIndexOf(".");
  if (dotIndex === -1) return filename.slice(0, maxLength);

  const name = filename.slice(0, dotIndex);
  const ext = filename.slice(dotIndex);

  if (filename.length > maxLength) {
    const availableLength = maxLength - ext.length;
    return name.slice(0, availableLength) + ext;
  }

  return filename;
}

interface Props {
  isEdit: Boolean
  error?: FieldError | Merge<FieldError, FieldErrorsImpl<any>> | undefined | null;
  setFiles(file: File[] | any): void
  clearErrors(name: any): void
  initValue:
  | {
    id: number
    file: string
    name: string
  }[]
  | null
  setError(
    name: string,
    type: {
      type: string
      message: string
    }
  ): void
  customStyle?: CSSProperties;
}

const CkDownloundFiles: FC<Props> = ({
  setFiles,
  error,
  initValue,
  isEdit,
  setError,
  clearErrors,
  customStyle
}) => {

  const { t } = useTranslation()
  const [file, setFile] = useState<File[] | any>([])
  const { modals } = store
  const handleChange = (file2: File) => {
    const truncatedName = truncateFilename(file2.name);

    if (file2.size > 73400320) {
      setError('file', {
        type: 'custom',
        message: `${t('tender_page.max_file_size')} - 70 MB `
      });
    } else {
      clearErrors('file');
      const renamedFile = new File([file2], truncatedName, { type: file2.type });

      setFile([...file, renamedFile]);
      setFiles([...file, renamedFile]);
    }
  }
  const removeFile = (filex: number) => {

    const array = file?.filter((_e: any, index: number) => index !== filex)
    if (array.length === 0) {
      setError("file", {
        type: 'custom',
        message: t('forms.card.button_loader_title'),
      })
    }
    setFile(array)
    setFiles(array)
  }
  useEffect(() => {
    if (initValue?.length !== 0) {
      handleFileConversion(initValue)
    } else {
    }
    if (modals?.ressetTenderFiles) {
      setFile([])
    }
    modals?.openTenderFilers()
  }, [initValue])

  const handleFileConversion = async (
    fileUrls:
      | {
        id: number
        file: string
        name: string
      }[]
      | any
  ) => {
    const fileObjects = await convertFiles(fileUrls)
    setFile(fileObjects)
    setFiles(fileObjects)
  }

  const downloadFile = (file: File) => {
    const downloadLink = document.createElement('a');
    downloadLink.href = URL.createObjectURL(file);
    downloadLink.download = file.name;
    downloadLink.click();
    URL.revokeObjectURL(downloadLink.href);
  }

  useEffect(() => {

  }, [])
  return (
    <div className={s.container} style={customStyle}>
      <FileUploader
        maxSize={100}
        className={s.fileUploader}
        disabled={isEdit}
        handleChange={handleChange}
        name="file"
        types={fileTypes}
      >
        <div className={s.wrapper} style={customStyle}>
          <p className={clsx(s.title, 'medium-20')}>
            {t('forms.card.button_loader_title')}
          </p>
          <div>
            <Icon
              className={s.icon}
              id="folder-upload"
              width={40}
              height={40}
            />
          </div>
          <p className={clsx(s.subtitle, 'light-14')}>{t('file_loader')}</p>
          <p className={clsx(s.subtitle_green, 'light-14')}>
            {file?.length} {t('files')}
          </p>
        </div>
      </FileUploader>
      <p className={clsx(s.error, 'light-12')}>
        {typeof error?.message === 'string' ? error.message : ''}
      </p>

      <div className={s.docsWrapper}>
        {file?.map((item: any, index: number) => (
          <div onClick={() => downloadFile(item)} key={index} className={s.doc}>
            <div className={s.iconFile}>
              <Icon id="pdf" width={24} height={24} />
            </div>
            <div>
              <p className="light-16">{item.name}</p>
              <p className="light-12">
                {item.size && formatFileSize(item.size, 3)}
              </p>
            </div>
            <div
              className={clsx(s.iconCross, isEdit && s.disabled)}
              onClick={(e) => {
                e.stopPropagation()
                !isEdit && removeFile(index)
              }}
            >
              <Icon id="cross-around" height={23} width={23} />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default CkDownloundFiles
