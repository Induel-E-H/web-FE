import { useEffect } from 'react';
import {
  FiClock,
  FiDatabase,
  FiHome,
  FiShare2,
  FiTrash2,
  FiTruck,
} from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';

import { COMPANY } from '@shared/constant';
import { Footer } from '@widgets/footer';
import { Header } from '@widgets/header/ui/Header';

import './styles/PrivacyPolicy.css';

const TOC = [
  '개인정보의 처리 목적',
  '처리하는 개인정보의 항목',
  '14세 미만 아동의 개인정보 처리에 관한 사항',
  '개인정보의 처리 및 보유 기간',
  '개인정보의 파기 절차 및 방법',
  '개인정보의 제3자 제공에 관한 사항',
  '개인정보 처리업무의 위탁에 관한 사항',
  '개인정보의 국외 수집 및 이전에 관한 사항',
  '개인정보의 안전성 확보조치에 관한 사항',
  '개인정보 자동 수집 장치의 설치·운영 및 거부에 관한 사항',
  '개인정보 자동 수집 장치를 통해 제3자가 행태정보를 수집하도록 허용하는 경우 그 수집·이용 및 거부에 관한 사항',
  '정보주체와 법정대리인의 권리·의무 및 행사방법에 관한 사항',
  '개인정보 보호책임자의 성명 또는 개인정보 업무 담당부서 및 고충사항을 처리하는 부서에 관한 사항',
  '정보주체의 권익침해에 대한 구제방법',
  '개인정보 처리방침의 변경에 관한 사항',
];

export function PrivacyPolicy() {
  const navigate = useNavigate();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className='privacy-policy'>
      <Header />

      <main className='privacy-policy__main'>
        <div className='privacy-policy__container'>
          <section className='privacy-policy__hero'>
            <h1 className='privacy-policy__title'>개인정보처리방침</h1>
            <p className='privacy-policy__intro'>
              (주) 인들이앤에이치(이하 '회사')는 정보주체의 자유와 권리 보호를
              위해 「개인정보 보호법」 및 관계 법령이 정한 바를 준수하여,
              적법하게 개인정보를 처리하고 안전하게 관리하고 있습니다. 이에
              「개인정보 보호법」제30조에 따라 정보주체에게 개인정보의 처리와
              보호에 관한 절차 및 기준을 안내하고, 이와 관련한 고충을 신속하고
              원활하게 처리할 수 있도록 하기 위하여 다음과 같이 개인정보
              처리방침을 수립·공개합니다.
            </p>
            <p className='privacy-policy__effective'>시행일: 2026. 04. 27</p>
          </section>

          <section
            className='privacy-policy__highlights'
            aria-label='주요 개인정보 처리 표시'
          >
            <div className='privacy-policy__highlight-card'>
              <FiDatabase
                className='privacy-policy__highlight-icon'
                aria-hidden='true'
              />
              <div className='privacy-policy__highlight-body'>
                <strong>수집 항목</strong>
                <p>
                  IP주소, 쿠키, 방문일시,
                  <br />
                  서비스 이용기록, 기기정보
                </p>
              </div>
            </div>
            <div className='privacy-policy__highlight-card'>
              <FiClock
                className='privacy-policy__highlight-icon'
                aria-hidden='true'
              />
              <div className='privacy-policy__highlight-body'>
                <strong>보유 기간</strong>
                <p>
                  최대 14개월
                  <br />
                  (Google Analytics)
                </p>
              </div>
            </div>
            <div className='privacy-policy__highlight-card'>
              <FiShare2
                className='privacy-policy__highlight-icon'
                aria-hidden='true'
              />
              <div className='privacy-policy__highlight-body'>
                <strong>제3자 제공</strong>
                <p>
                  원칙적 미제공
                  <br />
                  (법령에 따라 예외)
                </p>
              </div>
            </div>
            <div className='privacy-policy__highlight-card'>
              <FiTruck
                className='privacy-policy__highlight-icon'
                aria-hidden='true'
              />
              <div className='privacy-policy__highlight-body'>
                <strong>처리 위탁</strong>
                <p>
                  Google LLC
                  <br />
                  (이용 통계 분석)
                </p>
              </div>
            </div>
            <div className='privacy-policy__highlight-card'>
              <FiTrash2
                className='privacy-policy__highlight-icon'
                aria-hidden='true'
              />
              <div className='privacy-policy__highlight-body'>
                <strong>파기 방법</strong>
                <p>
                  전자파일 재생불가 파기
                  <br />
                  종이문서 분쇄·소각
                </p>
              </div>
            </div>
          </section>

          <nav className='privacy-policy__toc' aria-label='목차'>
            <h2 className='privacy-policy__toc-title'>목차</h2>
            <ol className='privacy-policy__toc-list'>
              {TOC.map((title, index) => (
                <li key={title}>
                  <a href={`#section-${index + 1}`}>
                    제 {index + 1}조 {title}
                  </a>
                </li>
              ))}
            </ol>
          </nav>

          <div className='privacy-policy__content'>
            <article id='section-1' className='privacy-policy__article'>
              <h2 className='privacy-policy__article-title'>
                ■ 제 1조 개인정보의 처리 목적
              </h2>
              <p>
                (주) 인들이앤에이치는 다음의 목적을 위하여 개인정보를
                처리합니다. 처리하고 있는 개인정보는 다음의 목적 외의 용도로는
                이용되지 않으며, 이용 목적이 변경되는 경우에는 「개인정보
                보호법」제18조에 따라 별도의 동의를 받는 등 필요한 조치를 이행할
                예정입니다.
              </p>
              <ol className='privacy-policy__ordered-list'>
                <li>
                  <strong>서비스 제공</strong>
                  <p>
                    웹사이트 제공 및 접속 관리, 콘텐츠 제공 등 기본적인 서비스
                    제공을 목적으로 개인정보를 처리합니다.
                  </p>
                </li>
                <li>
                  <strong>서비스 이용 통계 분석 및 개선</strong>
                  <p>
                    서비스 이용에 대한 분석, 인구통계학적 분석 및 서비스 개선을
                    목적으로 개인정보를 처리합니다.
                  </p>
                </li>
              </ol>
            </article>

            <article id='section-2' className='privacy-policy__article'>
              <h2 className='privacy-policy__article-title'>
                ■ 제 2조 처리하는 개인정보의 항목
              </h2>
              <p>
                (주) 인들이엔에이치는 다음과 같은 개인정보 법적 근거로
                정보주체의 개인정보를 수집 및 이용합니다.
              </p>
              <ol className='privacy-policy__ordered-list'>
                <li>
                  <strong>서비스 이용 과정에서 자동으로 수집되는 정보</strong>
                  <ul className='privacy-policy__unordered-list'>
                    <li>
                      IP 주소, 쿠키, 방문 일시, 서비스 이용 기록, 브라우저 및
                      기기 정보
                    </li>
                  </ul>
                </li>
              </ol>
            </article>

            <article id='section-3' className='privacy-policy__article'>
              <h2 className='privacy-policy__article-title'>
                ■ 제 3조 14세 미만 아동의 개인정보 처리에 관한 사항
              </h2>
              <p>
                (주) 인들이앤에이치는 만 14세 미만 사용자의 개인정보는 수집하지
                않습니다. 단, 만 14세 미만 아동의 개인정보를 처리하기 위하여
                개인정보보호법에 따른 동의를 받아야 할 때는 그 법정대리인에게
                동의를 받고, 개인정보 사용이 끝나면 해당 정보를 바로 삭제하며,
                개인정보가 사용되는 동안 개인정보를 안전하게 관리합니다.
              </p>
              <p className='privacy-policy__note'>
                ※ 법정대리인 동의를 받기 위하여 아동에게 법정대리인의 성명,
                연락처와 같이 최소한의 정보를 요구할 수 있으며, 아래 방법으로
                법정대리인의 동의를 확인합니다.
              </p>
              <ul className='privacy-policy__unordered-list'>
                <li>
                  법정대리인에게 동의내용이 적힌 서면을 제공하여 서명 날인 후
                  제출하게 하는 방법
                </li>
                <li>
                  그 밖에 위와 준하는 방법으로 법정대리인에게 동의 내용을 알리고
                  동의 여부를 확인하는 방법
                </li>
              </ul>
            </article>

            <article id='section-4' className='privacy-policy__article'>
              <h2 className='privacy-policy__article-title'>
                ■ 제 4조 개인정보의 처리 및 보유 기간
              </h2>
              <p>
                (주) 인들이앤에이치는 법령에 따른 개인정보 보유·이용 기간 또는
                정보주체로부터 개인정보 수집 시 안내한 보유·이용 기간 내에서
                개인정보를 처리·보유합니다.
              </p>
              <p>각각의 개인정보 처리 및 보유 기간은 다음과 같습니다.</p>
              <ol className='privacy-policy__ordered-list'>
                <li>
                  <strong>서비스 이용 통계 분석 정보</strong>
                  <ul className='privacy-policy__unordered-list'>
                    <li>
                      Google Analytics를 통해 수집된 정보는 14개월간 보관되며,
                      이후 자동 삭제됩니다.
                    </li>
                  </ul>
                </li>
              </ol>
            </article>

            <article id='section-5' className='privacy-policy__article'>
              <h2 className='privacy-policy__article-title'>
                ■ 제 5조 개인정보의 파기 절차 및 방법
              </h2>
              <p>
                (주) 인들이앤에이치는 개인정보 보유기간의 경과, 처리목적 달성 등
                개인정보가 불필요하게 되었을 때에는 지체없이 해당 개인정보를
                파기합니다. 정보주체로부터 동의받은 개인정보 보유기간이
                경과하거나 처리목적이 달성되었음에도 불구하고 다른 법령에
                개인정보를 계속 보존하여야 하는 경우에는, 해당 개인정보를 별도의
                데이터베이스(DB)로 옮기거나 보관장소를 달리하여 보존합니다.
              </p>
              <p>개인정보 파기의 절차 및 방법은 다음과 같습니다.</p>
              <ol className='privacy-policy__ordered-list'>
                <li>
                  <strong>파기절차</strong>
                  <p>
                    (주) 인들이앤에이치는 파기 사유가 발생한 개인정보를
                    선정하고, (주) 인들이앤에이치의 개인정보 보호 책임자의
                    승인을 받아 개인정보를 파기합니다.
                  </p>
                </li>
                <li>
                  <strong>파기방법</strong>
                  <p>
                    (주) 인들이앤에이치는 전자적 파일 형태로 기록·저장된
                    개인정보는 기록을 재생할 수 없도록 파기하며 종이 문서에
                    기록·저장된 개인정보는 분쇄기로 분쇄하거나 소각하여
                    파기합니다.
                  </p>
                </li>
                <li>
                  <strong>외부 서비스에 의해 처리되는 개인정보</strong>
                  <p>
                    Google Analytics를 통해 처리되는 개인정보는 각 서비스
                    제공자의 정책에 따라 일정 기간 보관 후 자동으로 삭제되며,
                    보관 기간은 제4조에서 확인할 수 있습니다.
                  </p>
                </li>
              </ol>
            </article>

            <article id='section-6' className='privacy-policy__article'>
              <h2 className='privacy-policy__article-title'>
                ■ 제 6조 개인정보의 제3자 제공에 관한 사항
              </h2>
              <p>
                (주) 인들이앤에이치는 정보주체의 개인정보를 제3자에게 제공하지
                않습니다.
              </p>
              <p>
                다만, 법령에 따라 제공 의무가 발생하는 경우에는 관련 법령에 따라
                개인정보를 제공할 수 있습니다.
              </p>
            </article>

            <article id='section-7' className='privacy-policy__article'>
              <h2 className='privacy-policy__article-title'>
                ■ 제 7조 개인정보 처리업무의 위탁에 관한 사항
              </h2>
              <p>
                (주)인들이앤에이치는 원활한 개인정보 업무 처리를 위하여 다음과
                같이 개인정보 처리 업무를 위탁하고 있습니다.
              </p>
              <div className='privacy-policy__table-wrap'>
                <table className='privacy-policy__table'>
                  <thead>
                    <tr>
                      <th>위탁받는 자(수탁자)</th>
                      <th>위탁업무</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>Google LLC</td>
                      <td>홈페이지 이용자 접속 및 이용 통계 분석</td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <p>
                ② (주)인들이앤에이치는 위탁계약 체결 시 「개인정보 보호법」
                제26조에 따라 위탁업무 수행목적 외 개인정보 처리금지,
                기술적·관리적 보호조치, 재위탁 제한, 수탁자에 대한 관리·감독,
                손해배상 등 책임에 관한 사항을 계약서 등 문서에 명시하고,
                수탁자가 개인정보를 안전하게 처리하는지를 감독하고 있습니다.
              </p>
              <p>
                ③ 「개인정보 보호법」 제26조제6항에 따라 수탁자가 당사의
                개인정보 처리 업무를 재위탁하는 경우 (주)인들이앤에이치의 동의를
                받고 있으며, 본 개인정보 처리방침을 통하여 재수탁자와 재수탁하는
                업무의 내용을 공개하고 있습니다.
              </p>
              <p>
                ④ 위탁업무의 내용이나 수탁자가 변경될 경우에는 지체없이 본
                개인정보 처리방침을 통하여 공개하도록 하겠습니다.
              </p>
              <p>
                ⑤ 개인정보 처리 업무를 국외에 위탁하는 경우는 '제10조 개인정보의
                국외 수집 및 이전에 관한 사항'에서 안내하고 있습니다.
              </p>
            </article>

            <article id='section-8' className='privacy-policy__article'>
              <h2 className='privacy-policy__article-title'>
                ■ 제 8조 개인정보의 국외 수집 및 이전에 관한 사항
              </h2>
              <p>
                (주)인들이앤에이치는 서비스 이용 통계 분석 및 웹사이트 운영을
                위하여 개인정보를 국외에 이전하고 있습니다.
              </p>
              <ol className='privacy-policy__ordered-list'>
                <li>
                  <strong>국외이전의 법적 근거</strong>
                  <ul className='privacy-policy__unordered-list'>
                    <li>
                      「개인정보 보호법」 제28조의8제1항제3호 (계약 이행을 위한
                      국외 처리위탁·보관)
                    </li>
                  </ul>
                </li>
                <li>
                  <strong>이전하는 개인정보 항목</strong>
                  <ul className='privacy-policy__unordered-list'>
                    <li>
                      쿠키, IP 주소, 기기 및 브라우저 정보, 서비스 이용 기록
                    </li>
                  </ul>
                </li>
                <li>
                  <strong>개인정보 이전 국가</strong>
                  <ul className='privacy-policy__unordered-list'>
                    <li>미국</li>
                  </ul>
                </li>
                <li>
                  <strong>개인정보 이전 시기 및 방법</strong>
                  <ul className='privacy-policy__unordered-list'>
                    <li>
                      사용자가 웹사이트에 접속하여 서비스를 이용하는 시점에
                      네트워크를 통한 전송
                    </li>
                  </ul>
                </li>
                <li>
                  <strong>개인정보를 이전 받는 자</strong>
                  <ul className='privacy-policy__unordered-list'>
                    <li>Google LLC</li>
                  </ul>
                </li>
                <li>
                  <strong>개인정보 이용 목적 및 보유·이용기간</strong>
                  <ul className='privacy-policy__unordered-list'>
                    <li>
                      Google LLC (analytics.google.com): 서비스 이용 통계 분석 /
                      14개월
                    </li>
                  </ul>
                </li>
                <li>
                  <strong>개인정보 이전 거부 방법 및 거부 효과</strong>
                  <ul className='privacy-policy__unordered-list'>
                    <li>
                      정보주체는 브라우저 설정을 통해 쿠키 저장을 거부할 수
                      있습니다.
                    </li>
                    <li>
                      쿠키 저장을 거부할 경우 일부 서비스 이용에 제한이 있을 수
                      있습니다.
                    </li>
                  </ul>
                </li>
              </ol>
            </article>

            <article id='section-9' className='privacy-policy__article'>
              <h2 className='privacy-policy__article-title'>
                ■ 제 9조 개인정보의 안전성 확보조치에 관한 사항
              </h2>
              <p>
                (주) 인들이앤에이치는 개인정보의 안전성 확보를 위해 다음과 같은
                조치를 취하고 있습니다.
              </p>
              <ol className='privacy-policy__ordered-list'>
                <li>
                  <strong>관리적 조치</strong>
                  <ul className='privacy-policy__unordered-list'>
                    <li>
                      개인정보 보호를 위한 내부 관리 기준을 수립하고 최소한의
                      범위에서 개인정보를 처리합니다.
                    </li>
                    <li>
                      개인정보 처리 권한을 최소한의 인원으로 제한하고 있으며,
                      접근 권한에 대한 관리 및 변경 이력을 관리합니다.
                    </li>
                  </ul>
                </li>
                <li>
                  <strong>기술적 조치</strong>
                  <ul className='privacy-policy__unordered-list'>
                    <li>
                      개인정보가 포함된 데이터는 전송 시 암호화 통신(HTTPS)을
                      사용하여 보호합니다.
                    </li>
                    <li>
                      Google Analytics 등 외부 서비스를 이용하는 경우 각 서비스
                      제공자의 보안 정책 및 보호조치를 적용받습니다.
                    </li>
                    <li>
                      관리자 계정에 대한 접근 통제 및 인증 절차를 적용하여 무단
                      접근을 방지하고 있습니다.
                    </li>
                    <li>
                      접속 기록 및 서비스 이용 기록에 대한 접근을 제한하고, 이상
                      징후 발생 시 대응할 수 있도록 관리하고 있습니다.
                    </li>
                  </ul>
                </li>
                <li>
                  <strong>물리적 조치</strong>
                  <ul className='privacy-policy__unordered-list'>
                    <li>
                      본 서비스는 외부 클라우드 기반 인프라를 사용하고 있으며,
                      물리적 서버 관리는 각 서비스 제공자의 보안 정책에 따라
                      안전하게 운영됩니다.
                    </li>
                  </ul>
                </li>
              </ol>
            </article>

            <article id='section-10' className='privacy-policy__article'>
              <h2 className='privacy-policy__article-title'>
                ■ 제 10조 개인정보 자동 수집 장치의 설치·운영 및 거부에 관한
                사항
              </h2>
              <p>
                (주) 인들이앤에이치는 서비스 이용 과정에서 이용 정보를 저장하고
                수시로 불러오는 '쿠키(Cookie)'를 사용합니다. 쿠키는 웹사이트
                운영에 이용되는 서버(http)가 정보주체의 브라우저에 보내는 소량의
                정보로서 정보주체의 컴퓨터 또는 모바일에 저장되며, 웹사이트 접속
                시 정보주체의 브라우저에서 서버로 자동 전송됩니다.
              </p>
              <ol className='privacy-policy__ordered-list'>
                <li>
                  <strong>쿠키의 사용 목적</strong>
                  <ul className='privacy-policy__unordered-list'>
                    <li>
                      Google Analytics를 이용하여 웹사이트 이용 현황을 분석하고
                      서비스 개선을 위해 사용됩니다.
                    </li>
                  </ul>
                </li>
                <li>
                  <strong>수집 항목 및 방법</strong>
                  <ul className='privacy-policy__unordered-list'>
                    <li>
                      수집 항목: 쿠키, IP 주소, 기기 및 브라우저 정보, 서비스
                      이용 기록
                    </li>
                    <li>수집 방법: 웹사이트 방문 및 이용 시 자동 수집</li>
                  </ul>
                </li>
                <li>
                  <p>
                    정보주체는 브라우저 옵션 설정을 통해 쿠키 허용, 차단 등의
                    설정을 할 수 있습니다.
                  </p>
                </li>
              </ol>
              <div className='privacy-policy__cookie-guide'>
                <p className='privacy-policy__cookie-guide-title'>
                  쿠키 허용 / 차단 방법
                </p>
                <p>▶ 웹 브라우저에서 쿠키 허용/차단</p>
                <ul className='privacy-policy__unordered-list'>
                  <li>
                    크롬(Chrome): 웹브라우저 오른쪽 상단 '⋮' 표시 선택 &gt; 새
                    시크릿 창 (단축키: Ctrl+Shift+N)
                  </li>
                  <li>
                    엣지(Edge): 웹 브라우저 오른쪽 상단 '…' 표시 선택 &gt; 새
                    InPrivate 창 (단축키: Ctrl+Shift+N)
                  </li>
                </ul>
                <p>▶ 모바일 브라우저에서 쿠키 허용/차단</p>
                <ul className='privacy-policy__unordered-list'>
                  <li>
                    크롬(Chrome): 모바일 브라우저 오른쪽 상단 '⋮' 표시 선택 &gt;
                    새 시크릿 탭
                  </li>
                  <li>
                    사파리(Safari): 모바일 기기 설정 &gt; 사파리(Safari) &gt;
                    고급 &gt; 모든 쿠키 차단
                  </li>
                  <li>
                    삼성 인터넷: 모바일 브라우저 아래쪽 '탭' 아이콘 선택 &gt;
                    비밀 모드 켜기 &gt; 시작
                  </li>
                </ul>
              </div>
            </article>

            <article id='section-11' className='privacy-policy__article'>
              <h2 className='privacy-policy__article-title'>
                ■ 제 11조 개인정보 자동 수집 장치를 통해 제3자가 행태정보를
                수집하도록 허용하는 경우 그 수집·이용 및 거부에 관한 사항
              </h2>
              <p>
                (주) 인들이앤에이치는 서비스 이용 통계 분석을 위해 제3자가
                개인정보 자동 수집 장치를 통해 행태정보를 수집하도록 허용하고
                있습니다.
              </p>
              <ol className='privacy-policy__ordered-list'>
                <li>수집 장치 명칭: Google Analytics 태그</li>
                <li>수집 장치 종류: 자바스크립트 기반 웹 분석 도구</li>
                <li>수집해가는 사업자: Google LLC</li>
                <li>
                  수집 항목: IP 주소, 브라우저 정보, 방문 페이지, 방문 시간,
                  이용 기록 등
                </li>
                <li>수집 목적: 웹사이트 이용 통계 분석 및 서비스 개선</li>
                <li>보유 및 이용 기간: 최대 14개월</li>
                <li>
                  거부 방법: 이용자는 웹 브라우저 설정을 통해 쿠키 저장을
                  거부하거나 삭제할 수 있습니다. (제 10조 참조)
                </li>
              </ol>
            </article>

            <article id='section-12' className='privacy-policy__article'>
              <h2 className='privacy-policy__article-title'>
                ■ 제 12조 정보주체와 법정대리인의 권리·의무 및 행사방법에 관한
                사항
              </h2>
              <p>
                정보주체는 (주) 인들이앤에이치에 대해 언제든지 개인정보
                열람·전송·정정·삭제·처리정지 및 동의 철회 등을 요구(이하 "권리
                행사"라 함)할 수 있습니다.
              </p>
              <p className='privacy-policy__note'>
                ※ 14세 미만 아동의 권리 행사는 법정대리인이 직접 해야 하며, 14세
                이상의 미성년자인 정보주체는 정보주체의 개인정보에 관하여
                미성년자 본인이 권리를 행사하거나 법정대리인을 통하여 권리를
                행사할 수 있습니다.
              </p>
              <p>
                권리 행사는 (주) 인들이앤에이치에 대해 「개인정보 보호법
                시행령」제41조제1항에 따라 서면, 전화, 전자 우편, 팩스(FAX),
                인터넷 등을 통하여 하실 수 있으며, (주) 인들이앤에이치는 이에
                대해 지체없이 조치하겠습니다.
              </p>
              <p>
                권리 행사는 정보주체의 법정대리인이나 위임을 받은 자 등 대리인을
                통하여 하실 수도 있습니다. 이 경우 "개인정보 처리 방법에 관한
                고시" [별지 11] 서식에 따른 위임장을 제출하셔야 합니다.
              </p>
              <p>
                정보주체가 개인정보 열람 및 처리 정지를 요구할 권리는 「개인정보
                보호법」제35조제4항 및 제37조제2항에 의하여 제한될 수 있습니다.
              </p>
              <p>
                다른 법령에서 그 개인정보가 수집 대상으로 명시되어 있는 경우에는
                해당 개인정보의 삭제를 요구할 수 없습니다.
              </p>
              <p>
                (주) 인들이앤에이치는 권리 행사를 한 자가 본인이거나 정당한
                대리인인지를 확인합니다.
              </p>
              <p>
                정보주체는 권리 행사를 아래의 부서에 할 수 있습니다. (주)
                인들이앤에이치는 정보주체로부터 권리 행사를 청구받은 날로부터
                10일 이내에 회신하겠습니다.
              </p>
              <div className='privacy-policy__contact-box'>
                <p className='privacy-policy__contact-box-title'>
                  ▶ 개인정보 권리 행사 청구 접수·처리 부서
                </p>
                <ul className='privacy-policy__contact-list'>
                  <li>
                    <span>대표</span>
                    <span>{COMPANY.CEO}</span>
                  </li>
                  <li>
                    <span>주소</span>
                    <span>{COMPANY.ADDRESS_FULL}</span>
                  </li>
                  <li>
                    <span>TEL</span>
                    <span>{COMPANY.PHONE_DISPLAY}</span>
                  </li>
                  <li>
                    <span>E-MAIL</span>
                    <span>{COMPANY.EMAIL}</span>
                  </li>
                  <li>
                    <span>FAX</span>
                    <span>{COMPANY.FAX}</span>
                  </li>
                </ul>
              </div>
            </article>

            <article id='section-13' className='privacy-policy__article'>
              <h2 className='privacy-policy__article-title'>
                ■ 제 13조 개인정보 보호책임자의 성명 또는 개인정보 업무 담당부서
                및 고충사항을 처리하는 부서에 관한 사항
              </h2>
              <p>
                (주) 인들이앤에이치는 개인정보 처리에 관한 업무를 총괄해서
                책임지고, 개인정보 처리와 관련한 정보 주체의 불만처리 및
                피해구제 등을 위하여 아래와 같이 개인정보 보호책임자를 지정하고
                있습니다.
              </p>
              <div className='privacy-policy__contact-box'>
                <p className='privacy-policy__contact-box-title'>
                  ▶ 개인정보 보호책임자
                </p>
                <ul className='privacy-policy__contact-list'>
                  <li>
                    <span>성명</span>
                    <span>{COMPANY.CEO}</span>
                  </li>
                  <li>
                    <span>직위</span>
                    <span>대표</span>
                  </li>
                  <li>
                    <span>연락처</span>
                    <span>{COMPANY.PHONE_DISPLAY}</span>
                  </li>
                  <li>
                    <span>이메일</span>
                    <span>{COMPANY.EMAIL}</span>
                  </li>
                  <li>
                    <span>팩스</span>
                    <span>{COMPANY.FAX}</span>
                  </li>
                </ul>
              </div>
              <p>
                정보주체는 (주) 인들이앤에이치의 서비스를 이용하시면서 발생한
                모든 개인정보보호 관련 문의, 불만처리, 피해구제 등에 관한 사항을
                개인정보 보호책임자 및 개인정보보호 담당부서로 문의할 수
                있습니다. (주) 인들이앤에이치는 정보주체의 문의에 대해 지체없이
                답변 및 처리해 드릴 것입니다.
              </p>
            </article>

            <article id='section-14' className='privacy-policy__article'>
              <h2 className='privacy-policy__article-title'>
                ■ 제 14조 정보주체의 권익침해에 대한 구제방법
              </h2>
              <p>
                정보주체는 개인정보침해로 인한 구제를 받기 위하여 개인정보
                분쟁조정위원회, 한국인터넷진흥원 개인정보 침해 신고센터 등에
                분쟁해결이나 상담 등을 신청할 수 있습니다. 이 밖에 기타
                개인정보침해의 신고, 상담에 대하여는 아래의 기관에 문의하시기
                바랍니다.
              </p>
              <ol className='privacy-policy__ordered-list'>
                <li>
                  개인정보 분쟁조정위원회: (국번없이) 1833-6972
                  (www.kopico.go.kr)
                </li>
                <li>
                  개인정보침해 신고센터: (국번없이) 118 (privacy.kisa.or.kr)
                </li>
                <li>경찰청: (국번없이) 182 (ecrm.police.go.kr)</li>
              </ol>
            </article>

            <article id='section-15' className='privacy-policy__article'>
              <h2 className='privacy-policy__article-title'>
                ■ 제 15조 개인정보 처리방침의 변경에 관한 사항
              </h2>
              <p>이 개인정보 처리방침은 2026. 04. 27부터 적용됩니다.</p>
              <p>이전 버전은 존재하지 않습니다.</p>
            </article>
          </div>

          {/* 메인 페이지로 가는 버튼 */}
          <div className='privacy-policy__back'>
            <button
              className='privacy-policy__back-btn'
              onClick={() => void navigate('/')}
            >
              <FiHome aria-hidden='true' />
              메인 페이지로 돌아가기
            </button>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
