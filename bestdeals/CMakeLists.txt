cmake_minimum_required(VERSION 3.16)
project(bestdeals LANGUAGES CXX)

# C++-standardi
set(CMAKE_CXX_STANDARD 17)
set(CMAKE_CXX_STANDARD_REQUIRED ON)

# Qt automaattijutut
set(CMAKE_AUTOMOC ON)
set(CMAKE_AUTOUIC ON)
set(CMAKE_AUTORCC ON)

# Qt6
find_package(Qt6 REQUIRED COMPONENTS Core Gui Widgets Svg Network)

# Hakemistot
set(SRC_DIR ${CMAKE_SOURCE_DIR}/src)
set(API_DIR ${SRC_DIR}/api)
set(UI_DIR  ${SRC_DIR}/ui)
set(RES_DIR ${SRC_DIR}/resources)

# Lähdekoodit – HUOM: main.cpp on suoraan src/:ssä
add_executable(bestdeals
    ${SRC_DIR}/main.cpp
    ${UI_DIR}/mainwindow.cpp
    ${API_DIR}/cheapshark.cpp
    ${API_DIR}/levenshtein.cpp
    ${API_DIR}/rawgapi.cpp
    ${RES_DIR}/resources.qrc
    ${UI_DIR}/gamecard.cpp
    ${UI_DIR}/dealcard.cpp
)

# Include-polut (jotta headerit ja json.hpp löytyvät)
target_include_directories(bestdeals PRIVATE
    ${SRC_DIR}
    ${API_DIR}
    ${UI_DIR}
    ${RES_DIR}
    ${CMAKE_SOURCE_DIR}/external   # json.hpp
)

# Qt-kirjastot
target_link_libraries(bestdeals PRIVATE
    Qt6::Core
    Qt6::Gui
    Qt6::Widgets
    Qt6::Svg
    Qt6::Network
)

# --- CURL alustakohtaisesti ------------------------------------------

if (WIN32)
    message(STATUS "Using external Windows libcurl")

    target_include_directories(bestdeals PRIVATE
        ${CMAKE_SOURCE_DIR}/external/curl/include
    )

    target_link_libraries(bestdeals PRIVATE
        ${CMAKE_SOURCE_DIR}/external/curl/lib/libcurl_imp.lib
    )

    set_target_properties(bestdeals PROPERTIES
        WIN32_EXECUTABLE ON
    )
else()
    message(STATUS "Using system libcurl on this platform")

    find_package(CURL REQUIRED)
    target_link_libraries(bestdeals PRIVATE CURL::libcurl)
endif()
