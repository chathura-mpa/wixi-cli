// Enum for conditional rendering and form logic
export enum ShowFor {
    NONE = 'NONE',
    ALL = 'ALL',
    SOME = 'SOME',
    COLLECTIONS = 'COLLECTIONS',
}

// File type (both API + Form)
export interface FileType {
    extension: string
    mimeType: string
}

// File object from the API
export interface ApiFileToUpload {
    fileId: string
    label: string
    info: string
    fileTypes: FileType[]
    deleted: boolean
}

// Upload field model from the API
export interface ApiUploadField {
    uploadFieldId: string
    name: string
    mandatory: boolean
    fileCount: number
    showFor: ShowFor
    productIds: string[]
    collectionIds: string[]
    filesToUpload: ApiFileToUpload[]
    deleted: boolean
}

// Upload field used in the Formik form
export interface UploadFieldForm {
    name: string
    mandatory: boolean
    fileCount: number
    showFor: ShowFor
    productIds: string[]
    collectionIds: string[]
    filesToUpload: {
        fileId?: string
        label: string
        info: string
        fileTypes: FileType[]
    }[]
    uploadFieldId?: string // optional, only used for updates
}