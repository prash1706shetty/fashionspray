module.exports = Object.freeze({
    CAAS_DOCUMENT_BRIEF: 'documents/language/{language}/brief',
    CASS_DOCUMENT_BY_ID_LANG: 'documents/{document_id}/en',
    CAAS_DOCUMENTFILE_BY_ID_LANG: 'documents/{document_id}/{language}/files?file={file_name}.json',
    CAAS_DOCUMENT_FILE_UPDATE_URL: 'documents/{document_id}/{language}/files?file={file_name}.json',
    CAAS_DOCUMENT_URL: 'documents/{document_id}/{language}',
    CAAS_DOCUMENT_CONTENT_ALL:'documents/{document_id}/{language}/contents/all',
    CAAS_TOC_DOC_INDEX: 'documents/{document_id}/{language}/files?file=toc.index',
    CAAS_SUB_CATALOG: 'subcatalog/production-products',
    CAAS_COPY_CATALOG: 'documents/{copyFromdocId}/en/copytocatalog/{copyToDocument}/{copyTodocId}',
    CAAS_MERGE_DOC:'documents/{document_id}/{language}/merge'
});
