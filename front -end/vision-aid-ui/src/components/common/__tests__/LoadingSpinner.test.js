import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import LoadingSpinner, { SkeletonLoader, ButtonLoader, ProgressBar } from '../LoadingSpinner';

describe('LoadingSpinner', () => {
    it('should render with default props', () => {
        render(<LoadingSpinner />);
        expect(screen.getByText('Loading...')).toBeInTheDocument();
    });

    it('should render with custom message', () => {
        render(<LoadingSpinner message="Processing..." />);
        expect(screen.getByText('Processing...')).toBeInTheDocument();
    });

    it('should render without message when message is empty', () => {
        render(<LoadingSpinner message="" />);
        expect(screen.queryByText('Loading...')).not.toBeInTheDocument();
    });

    it('should render in fullscreen mode', () => {
        const { container } = render(<LoadingSpinner fullScreen />);
        const fullscreenDiv = container.querySelector('.fixed.inset-0');
        expect(fullscreenDiv).toBeInTheDocument();
    });

    it('should apply correct size class', () => {
        const { container } = render(<LoadingSpinner size="lg" />);
        const spinner = container.querySelector('.w-24.h-24');
        expect(spinner).toBeInTheDocument();
    });

    it('should apply correct color class', () => {
        const { container } = render(<LoadingSpinner color="purple" />);
        const coloredElement = container.querySelector('.border-purple-500');
        expect(coloredElement).toBeInTheDocument();
    });
});

describe('SkeletonLoader', () => {
    it('should render default number of lines', () => {
        const { container } = render(<SkeletonLoader />);
        const lines = container.querySelectorAll('.bg-gray-700');
        expect(lines).toHaveLength(3);
    });

    it('should render custom number of lines', () => {
        const { container } = render(<SkeletonLoader lines={5} />);
        const lines = container.querySelectorAll('.bg-gray-700');
        expect(lines).toHaveLength(5);
    });

    it('should apply custom className', () => {
        const { container } = render(<SkeletonLoader className="custom-class" />);
        const wrapper = container.querySelector('.custom-class');
        expect(wrapper).toBeInTheDocument();
    });
});

describe('ButtonLoader', () => {
    it('should render loading text', () => {
        render(<ButtonLoader />);
        expect(screen.getByText('Loading...')).toBeInTheDocument();
    });

    it('should render with spinner', () => {
        const { container } = render(<ButtonLoader />);
        const spinner = container.querySelector('.border-white.border-t-transparent');
        expect(spinner).toBeInTheDocument();
    });

    it('should apply custom className', () => {
        const { container } = render(<ButtonLoader className="custom-button-loader" />);
        const loader = container.querySelector('.custom-button-loader');
        expect(loader).toBeInTheDocument();
    });
});

describe('ProgressBar', () => {
    it('should render with default progress', () => {
        render(<ProgressBar />);
        expect(screen.getByText('Processing...')).toBeInTheDocument();
        expect(screen.getByText('0%')).toBeInTheDocument();
    });

    it('should render with custom progress', () => {
        render(<ProgressBar progress={75} />);
        expect(screen.getByText('75%')).toBeInTheDocument();
    });

    it('should hide percentage when showPercentage is false', () => {
        render(<ProgressBar progress={50} showPercentage={false} />);
        expect(screen.queryByText('50%')).not.toBeInTheDocument();
    });

    it('should show processing text', () => {
        render(<ProgressBar />);
        expect(screen.getByText('Processing...')).toBeInTheDocument();
    });
});
