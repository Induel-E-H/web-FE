import { MemoryRouter } from 'react-router-dom';

import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { NotFound } from './NotFound';

const mockNavigate = vi.hoisted(() => vi.fn());
vi.mock('react-router-dom', async (importOriginal) => {
  const actual = await importOriginal<typeof import('react-router-dom')>();
  return { ...actual, useNavigate: () => mockNavigate };
});

function renderPage() {
  return render(
    <MemoryRouter>
      <NotFound />
    </MemoryRouter>,
  );
}

describe('NotFound', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('시맨틱 구조', () => {
    it('최상위 요소에 not-found 클래스가 있다', () => {
      const { container } = renderPage();
      expect(container.querySelector('.not-found')).toBeInTheDocument();
    });

    it('404 코드가 표시된다', () => {
      renderPage();
      expect(screen.getByText('404')).toBeInTheDocument();
    });

    it('h1 제목 "페이지를 찾을 수 없습니다"가 렌더링된다', () => {
      renderPage();
      expect(
        screen.getByRole('heading', {
          level: 1,
          name: '페이지를 찾을 수 없습니다',
        }),
      ).toBeInTheDocument();
    });

    it('안내 문구가 표시된다', () => {
      renderPage();
      expect(
        screen.getByText('요청하신 페이지가 존재하지 않거나 이동되었습니다.'),
      ).toBeInTheDocument();
    });
  });

  describe('홈으로 돌아가기 버튼', () => {
    it('버튼이 렌더링된다', () => {
      renderPage();
      expect(
        screen.getByRole('button', { name: '홈으로 돌아가기' }),
      ).toBeInTheDocument();
    });

    it('버튼 클릭 시 "/"로 navigate한다', async () => {
      renderPage();
      await userEvent.click(
        screen.getByRole('button', { name: '홈으로 돌아가기' }),
      );
      expect(mockNavigate).toHaveBeenCalledWith('/');
    });

    it('버튼 클릭 시 navigate가 정확히 1번 호출된다', async () => {
      renderPage();
      await userEvent.click(
        screen.getByRole('button', { name: '홈으로 돌아가기' }),
      );
      expect(mockNavigate).toHaveBeenCalledTimes(1);
    });
  });
});
