import Joyride, { CallBackProps, Step, STATUS, EVENTS } from "react-joyride";
import { useProductTour } from "@/hooks/useProductTour";

interface ProductTourProps {
  steps?: Step[];
}

const defaultSteps: Step[] = [
  {
    target: "body",
    content: (
      <div>
        <h2 className="text-xl font-bold mb-2 text-slate-900">
          Chào Mừng Đến Với TaskFlow! 🎉
        </h2>
        <p className="text-slate-600">
          Hãy để chúng tôi hướng dẫn bạn qua các tính năng chính trong vài phút.
          Bạn có thể bỏ qua hướng dẫn bất cứ lúc nào.
        </p>
      </div>
    ),
    placement: "center",
    disableBeacon: true,
  },
  {
    target: '[data-tour="workspace-selector"]',
    content: (
      <div>
        <h3 className="font-semibold mb-2 text-slate-900">Workspace</h3>
        <p className="text-slate-600">
          Đây là nơi bạn chọn workspace để làm việc. Bạn có thể tạo nhiều
          workspace cho các dự án khác nhau.
        </p>
      </div>
    ),
    disableBeacon: true,
  },
  {
    target: '[data-tour="create-task"]',
    content: (
      <div>
        <h3 className="font-semibold mb-2 text-slate-900">Tạo Công Việc</h3>
        <p className="text-slate-600">
          Click vào đây để tạo task mới. Bạn có thể thêm tiêu đề, mô tả, deadline
          và gán cho thành viên.
        </p>
      </div>
    ),
    disableBeacon: true,
  },
  {
    target: '[data-tour="navigation"]',
    content: (
      <div>
        <h3 className="font-semibold mb-2 text-slate-900">Điều Hướng</h3>
        <p className="text-slate-600">
          Sử dụng menu bên trái để chuyển giữa các view: Dashboard, Kanban,
          Calendar và Settings.
        </p>
      </div>
    ),
    disableBeacon: true,
  },
  {
    target: '[data-tour="notifications"]',
    content: (
      <div>
        <h3 className="font-semibold mb-2 text-slate-900">Thông Báo</h3>
        <p className="text-slate-600">
          Nhận thông báo real-time về các cập nhật công việc, deadline sắp tới và
          mentions từ team.
        </p>
      </div>
    ),
    disableBeacon: true,
  },
  {
    target: "body",
    content: (
      <div>
        <h2 className="text-xl font-bold mb-2 text-slate-900">
          Hoàn Thành! 🚀
        </h2>
        <p className="text-slate-600 mb-3">
          Bạn đã sẵn sàng để bắt đầu quản lý công việc hiệu quả với TaskFlow.
        </p>
        <p className="text-sm text-slate-500">
          Tip: Bạn có thể xem lại hướng dẫn bất cứ lúc nào trong Settings →
          Help.
        </p>
      </div>
    ),
    placement: "center",
    disableBeacon: true,
  },
];

export default function ProductTour({ steps = defaultSteps }: ProductTourProps) {
  const { tourState, completeTour, skipTour, setStepIndex } = useProductTour();

  const handleJoyrideCallback = (data: CallBackProps) => {
    const { status, index, type } = data;

    if (status === STATUS.FINISHED) {
      completeTour();
      return;
    }

    if (status === STATUS.SKIPPED) {
      skipTour();
      return;
    }

    if (type === EVENTS.STEP_AFTER || type === EVENTS.TARGET_NOT_FOUND) {
      setStepIndex(index + (type === EVENTS.TARGET_NOT_FOUND ? 1 : 0));
    }
  };

  return (
    <Joyride
      steps={steps}
      run={tourState.run}
      stepIndex={tourState.stepIndex}
      continuous
      showProgress
      showSkipButton
      callback={handleJoyrideCallback}
      styles={{
        options: {
          primaryColor: "#4f46e5", // indigo-600
          textColor: "#334155", // slate-700
          backgroundColor: "#ffffff",
          overlayColor: "rgba(0, 0, 0, 0.5)",
          zIndex: 10000,
        },
        buttonNext: {
          backgroundColor: "#4f46e5",
          fontSize: "14px",
          padding: "10px 20px",
          borderRadius: "8px",
        },
        buttonBack: {
          color: "#64748b",
          fontSize: "14px",
          padding: "10px 20px",
        },
        buttonSkip: {
          color: "#94a3b8",
          fontSize: "14px",
        },
        tooltip: {
          borderRadius: "12px",
          padding: "20px",
          fontSize: "15px",
        },
        tooltipContent: {
          padding: "0",
        },
      }}
      locale={{
        back: "Quay lại",
        close: "Đóng",
        last: "Hoàn thành",
        next: "Tiếp theo",
        skip: "Bỏ qua",
      }}
    />
  );
}

