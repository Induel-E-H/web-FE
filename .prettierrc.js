// prettier.config.js, .prettierrc.js, prettier.config.mjs, or .prettierrc.mjs

/**
 * @see https://prettier.io/docs/configuration
 * @type {import("prettier").Config}
 */
const config = {
  trailingComma: 'all', // 인자값 또는 객체에 마지막 값 또는 속성에 ',' 추가
  tabWidth: 2, // 탭은 2번씩
  semi: true, // 마지막 ';' 세미 콜론 추가
  singleQuote: true, // 모든 문자열은 싱글 쿼터 사용
  jsxSingleQuote: true, // jsx 안 HTML 내에서 싱글 쿼터 사용
  arrowParens: 'always', // 화살표 함수 인자값 괄호 여부
  endOfLine: 'lf', // 파일 EOF
  plugins: ['@trivago/prettier-plugin-sort-imports'],
  // Import 정렬 설정
  importOrder: [
    '^react',
    '<THIRD_PARTY_MODULES>',
    '^@/(.*)$',
    '^@assets/(.*)$',
    '^[./]',
  ],
  importOrderSeparation: true, // 그룹 간 빈 줄 추가
  importOrderSortSpecifiers: true, // import 내부 specifier 정렬
  importOrderGroupNamespaceSpecifiers: true, // namespace import 그룹화
  importOrderCaseInsensitive: true, // 대소문자 구분 없이 정렬
};

export default config;
