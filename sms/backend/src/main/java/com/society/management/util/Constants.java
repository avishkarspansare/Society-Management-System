package com.society.management.util;

/**
 * Application-wide constants.
 */
public final class Constants {

    private Constants() {
        // Prevent instantiation
    }

    // API
    public static final String API_BASE_URL = "/api/v1";

    // Pagination defaults
    public static final int DEFAULT_PAGE_SIZE = 10;
    public static final int MAX_PAGE_SIZE = 100;
    public static final String DEFAULT_SORT_FIELD = "createdAt";
    public static final String DEFAULT_SORT_DIRECTION = "desc";

    // JWT
    public static final String TOKEN_PREFIX = "Bearer ";
    public static final String HEADER_AUTHORIZATION = "Authorization";

    // Roles
    public static final String ROLE_SUPER_ADMIN = "ROLE_SUPER_ADMIN";
    public static final String ROLE_SOCIETY_ADMIN = "ROLE_SOCIETY_ADMIN";
    public static final String ROLE_COMMITTEE_MEMBER = "ROLE_COMMITTEE_MEMBER";
    public static final String ROLE_RESIDENT = "ROLE_RESIDENT";
    public static final String ROLE_SECURITY = "ROLE_SECURITY";
    public static final String ROLE_STAFF = "ROLE_STAFF";

    // Validation
    public static final int MIN_PASSWORD_LENGTH = 8;
    public static final int MAX_NAME_LENGTH = 100;
    public static final String PHONE_REGEX = "^[+]?[0-9\\s-]{10,15}$";
    public static final String PASSWORD_REGEX =
            "^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*[@#$%^&+=])(?=\\S+$).{8,}$";

    // Receipt number prefix
    public static final String RECEIPT_PREFIX = "RCT";

    // Date format
    public static final String DATE_FORMAT = "yyyy-MM-dd";
    public static final String DATETIME_FORMAT = "yyyy-MM-dd HH:mm:ss";
}
