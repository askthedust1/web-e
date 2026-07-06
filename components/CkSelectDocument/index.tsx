import clsx from 'clsx';
import Button from 'components/Buttons/Button';
import Icon from 'components/Icon';
import { useTranslation } from 'next-i18next';
import { useState, useEffect, FC } from 'react'
import { FileUploader } from 'react-drag-drop-files'
import style from "./ckSelect-document.module.scss"
import {
    DeepRequired,
    FieldError,
    FieldErrorsImpl,
    Merge,
} from "react-hook-form";


interface Props {
    label: string;
    fileTypes: string[];
    maxSize?: number;
    onChangeFiles?(files: File): void;
    error?: Merge<FieldError, FieldErrorsImpl<DeepRequired<File>>> | any;
}
const _fileTypes = ["DOC", "PDFL"];


const CkSelectDocument: FC<Props> = ({ label,
    fileTypes,
    maxSize = 10,
    onChangeFiles,
    error, }) => {
    const [preview, setPreview] = useState<string>("");

    const { t } = useTranslation()

    const handleChange = (file: File) => {
        if (file) {
            const objectUrl = URL.createObjectURL(file);
            setPreview(objectUrl);
        }
        onChangeFiles?.(file);

    };
    useEffect(() => {

        return () => URL.revokeObjectURL(preview);
    }, []);

    return (
        <div className={style.wrapper}>
            <div className={style.container}>

                <FileUploader
                    hoverTitle={t("forms.card.image_loader_title")}
                    handleChange={handleChange}
                    types={fileTypes}
                    maxSize={maxSize}
                >
                    <div className={style.loaderWrapper}>
                        {!preview ? (
                            <div className={style.loader}>
                                <div className={style.icon}>
                                    <Icon id="imgHendler" width={33} height={34} />
                                </div>

                                <p className={clsx(style.title, "light-16")}>{label}</p>
                                <p className={clsx(style.subtitle, "light-12")}>{t("forms.card.format_file")}</p>
                              <div className={clsx(style.subtitle, "light-12")}>
                                  {fileTypes.map((item) => (
                                        <p key={item} className={style.format}>{item}</p>
                                    ))}
                                </div>
                            </div>
                        ) : (
                            <div className={style.loader}>
                                <div className={style.icon}>
                                    <Icon id="imgHendler" width={33} height={34} />
                                </div>

                                <p className={clsx(style.title_green, "light-16")}>{t("forms.card.downloaed_file")}</p>

                            </div>
                        )}
                    </div>
                    <div className={clsx(style.button, "light-14")}>
                        <Button value={t("forms.card.button_loader_title")} isOutline isLong className={style.file_download_btn}/>
                    </div>
                </FileUploader>
                <div>
                    <p className={clsx(style.error, "light-12")}> {error?.message}</p>
                </div>
            </div>
        </div>
    )
}

export default CkSelectDocument