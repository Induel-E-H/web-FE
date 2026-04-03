import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import PATENT_LIST_DATA from '../model/PatentListData';
import PatentList from './PatentList';

describe('PatentList', () => {
  describe('초기 상태', () => {
    it('제목에 권리 소멸 건수가 표시된다', () => {
      render(<PatentList />);

      expect(
        screen.getByText(`권리 소멸 목록 (${PATENT_LIST_DATA.length}건)`),
      ).toBeInTheDocument();
    });

    it('초기에 목록이 닫혀있다', () => {
      render(<PatentList />);

      expect(screen.queryByRole('list')).not.toBeInTheDocument();
    });

    it('토글 버튼이 렌더링된다', () => {
      render(<PatentList />);

      expect(screen.getByRole('button')).toBeInTheDocument();
    });
  });

  describe('토글 동작', () => {
    it('버튼 클릭 시 목록이 열린다', () => {
      render(<PatentList />);

      fireEvent.click(screen.getByRole('button'));

      expect(screen.getByRole('list')).toBeInTheDocument();
    });

    it('열린 상태에서 버튼 클릭 시 목록이 닫힌다', () => {
      render(<PatentList />);
      const button = screen.getByRole('button');

      fireEvent.click(button);
      fireEvent.click(button);

      expect(screen.queryByRole('list')).not.toBeInTheDocument();
    });
  });

  describe('목록 내용', () => {
    it('목록이 열리면 모든 항목이 렌더링된다', () => {
      render(<PatentList />);

      fireEvent.click(screen.getByRole('button'));

      const items = screen.getAllByRole('listitem');
      expect(items).toHaveLength(PATENT_LIST_DATA.length);
    });

    it('목록이 열리면 각 특허 항목 텍스트가 표시된다', () => {
      render(<PatentList />);

      fireEvent.click(screen.getByRole('button'));

      const uniqueItems = [...new Set(PATENT_LIST_DATA)];
      uniqueItems.forEach((item) => {
        expect(screen.getAllByText(item).length).toBeGreaterThan(0);
      });
    });
  });
});
