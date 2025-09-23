import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { vi } from 'vitest';
import { Greeting, sum } from '../src/components/Greeting';

describe('Greeting component', () => {
  it('展示默认问候语', () => {
    render(<Greeting />);

    expect(screen.getByText('你好，欢迎使用 CDM 平台')).toBeInTheDocument();
    expect(screen.queryByTestId('suffix')).not.toBeInTheDocument();
  });

  it('展示自定义名称与后缀，并可交互', async () => {
    const suffixLabel = '确认';
    const onAcknowledge = vi.fn();
    const user = userEvent.setup();

    render(
      <Greeting
        name="  张伟  "
        suffix={
          <button type="button" data-testid="acknowledge" onClick={onAcknowledge}>
            {suffixLabel}
          </button>
        }
      />
    );

    expect(await screen.findByText('你好，张伟')).toBeInTheDocument();
    expect(screen.getByTestId('suffix')).toHaveTextContent(suffixLabel);

    await user.click(screen.getByTestId('acknowledge'));
    expect(onAcknowledge).toHaveBeenCalledTimes(1);
    expect(sum(2, 3)).toBe(5);
  });
});

describe('sum 工具函数', () => {
  it('返回两个数的和', () => {
    expect(sum(10, 5)).toBe(15);
  });
});
