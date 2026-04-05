#ifndef HWPING_FFI_H
#define HWPING_FFI_H

#include <stddef.h>
#include <stdint.h>

#ifdef __cplusplus
extern "C" {
#endif

typedef int32_t HwpingStatus;

enum {
    HWPING_STATUS_OK = 0,
    HWPING_ERROR_INVALID_ARGUMENT = 1,
    HWPING_ERROR_IO = 2,
    HWPING_ERROR_INVALID_FILE = 3,
    HWPING_ERROR_PAGE_OUT_OF_RANGE = 4,
    HWPING_ERROR_RENDER_FAILED = 5,
    HWPING_ERROR_UTF8 = 6,
    HWPING_ERROR_INTERNAL = 7,
};

typedef struct HwpingDocumentHandle HwpingDocumentHandle;

typedef struct HwpingDocumentInfo {
    uint8_t version_major;
    uint8_t version_minor;
    uint8_t version_build;
    uint8_t version_revision;
    uint32_t section_count;
    uint32_t page_count;
    uint8_t encrypted;
    uint8_t compressed;
    uint8_t distribution;
    uint8_t reserved;
} HwpingDocumentInfo;

typedef struct HwpingPageInfo {
    uint32_t page_index;
    uint32_t section_index;
    uint32_t width_hwp;
    uint32_t height_hwp;
    double width_px;
    double height_px;
} HwpingPageInfo;

typedef struct HwpingBuffer {
    uint8_t *ptr;
    size_t len;
} HwpingBuffer;

const char *hwping_last_error_message(void);
HwpingStatus hwping_document_open(const char *path, HwpingDocumentHandle **out_handle);
void hwping_document_free(HwpingDocumentHandle *handle);
HwpingStatus hwping_document_get_info(
    const HwpingDocumentHandle *handle,
    HwpingDocumentInfo *out_info
);
HwpingStatus hwping_document_get_first_page_info(
    const HwpingDocumentHandle *handle,
    HwpingPageInfo *out_info
);
HwpingStatus hwping_document_generate_preview_pdf(
    const HwpingDocumentHandle *handle,
    HwpingBuffer *out_buffer
);
void hwping_buffer_free(HwpingBuffer buffer);

#ifdef __cplusplus
}
#endif

#endif