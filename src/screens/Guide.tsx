import ScreenLayout from '../components/ScreenLayout';
import type { Screen } from '../types';

type Props = { navigate: (screen: Screen) => void };

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className='mb-6'>
      <h2 className='text-lg font-bold text-blue-700 mb-2'>{title}</h2>
      {children}
    </div>
  );
}

function Step({ num, children }: { num: number; children: React.ReactNode }) {
  return (
    <div className='flex gap-3 mb-2'>
      <span className='inline-flex items-center justify-center w-7 h-7 shrink-0 rounded-full bg-blue-600 text-white text-sm font-bold'>
        {num}
      </span>
      <p className='text-gray-700 leading-relaxed'>{children}</p>
    </div>
  );
}

function Note({ children }: { children: React.ReactNode }) {
  return (
    <div className='bg-yellow-50 border border-yellow-300 rounded-xl px-4 py-3 text-sm text-yellow-800 mt-2'>
      💡 {children}
    </div>
  );
}

export default function Guide({ navigate }: Props) {
  return (
    <ScreenLayout>
      <h1 className='text-2xl font-bold text-center mb-5'>HƯỚNG DẪN SỬ DỤNG</h1>

      <div className='flex-1 overflow-y-auto space-y-1 pb-2'>
        <Section title='1. Thiết lập danh sách ứng viên'>
          <Step num={1}>Nhập tên từng ứng viên vào ô văn bản, sau đó nhấn <b>+ THÊM</b> hoặc phím <b>Enter</b>.</Step>
          <Step num={2}>Lặp lại cho đến khi tất cả ứng viên đều có trong danh sách.</Step>
          <Step num={3}>Để xoá một ứng viên nhập sai, nhấn biểu tượng 🗑️ bên phải tên ứng viên đó.</Step>
          <Step num={4}>Khi danh sách đã đầy đủ, nhấn <b>BẮT ĐẦU KIỂM PHIẾU</b>.</Step>
          <Note>Phải có ít nhất 1 ứng viên mới có thể bắt đầu.</Note>
        </Section>

        <Section title='2. Kiểm từng phiếu bầu'>
          <Step num={1}>Mỗi màn hình tương ứng với <b>một phiếu bầu</b>. Tiêu đề hiển thị số thứ tự phiếu hiện tại.</Step>
          <Step num={2}>Mặc định, tất cả ứng viên được đánh dấu <b className='text-green-700'>✔ (được bầu)</b>.</Step>
          <Step num={3}>Chạm vào tên ứng viên bị <b className='text-red-600'>LOẠI</b> (gạch chân đỏ trên phiếu bầu thực tế) để chuyển sang trạng thái <b className='text-red-600'>❌ (bị loại)</b>.</Step>
          <Step num={4}>Chạm lại lần nữa để đổi lại thành ✔ nếu nhỡ tay.</Step>
          <Step num={5}>Sau khi kiểm xong phiếu, nhấn <b>PHIẾU KẾ TIẾP ▶</b> để lưu và chuyển sang phiếu tiếp theo.</Step>
          <Note>Mỗi phiếu bầu bắt buộc phải loại ít nhất 1 ứng viên. Nếu chưa loại ai, ứng dụng sẽ báo lỗi.</Note>
        </Section>

        <Section title='3. Sửa phiếu vừa kiểm'>
          <Step num={1}>Nhấn <b>◀ PHIẾU TRƯỚC</b> để quay lại phiếu trước đó và chỉnh sửa nếu kiểm nhầm.</Step>
          <Step num={2}>Sau khi sửa, nhấn <b>PHIẾU KẾ TIẾP ▶</b> để xác nhận lại.</Step>
          <Note>Chức năng quay lại chỉ có từ phiếu thứ 2 trở đi.</Note>
        </Section>

        <Section title='4. Kết thúc kiểm phiếu'>
          <Step num={1}>Sau khi kiểm xong tất cả phiếu, nhấn <b>KẾT THÚC KIỂM PHIẾU</b>.</Step>
          <Step num={2}>Nếu phiếu đang hiển thị chưa được kiểm (chưa loại ai), ứng dụng sẽ hỏi xác nhận — phiếu đó sẽ <b>không được tính</b> vào kết quả.</Step>
          <Step num={3}>Xác nhận để chuyển sang màn hình kết quả.</Step>
        </Section>

        <Section title='5. Xem & chia sẻ kết quả'>
          <Step num={1}>Màn hình kết quả hiển thị tổng số phiếu và số phiếu từng ứng viên nhận được.</Step>
          <Step num={2}>Nhấn <b>CHIA SẺ KẾT QUẢ</b> để sao chép hoặc gửi kết quả qua ứng dụng khác.</Step>
          <Step num={3}>Nhấn <b>PHIÊN KIỂM PHIẾU MỚI</b> để đặt lại và bắt đầu phiên mới (danh sách ứng viên được giữ nguyên).</Step>
        </Section>

        <Section title='6. Lịch sử kiểm phiếu'>
          <Step num={1}>Từ màn hình thiết lập, nhấn <b>XEM LỊCH SỬ KIỂM PHIẾU</b> để xem các phiên đã lưu.</Step>
          <Step num={2}>Nhấn vào một phiên để xem chi tiết kết quả và chia sẻ.</Step>
          <Step num={3}>Nhấn biểu tượng 🗑️ để xoá một phiên khỏi lịch sử.</Step>
          <Note>Dữ liệu được lưu trên thiết bị. Xoá bộ nhớ trình duyệt sẽ mất toàn bộ lịch sử.</Note>
        </Section>
      </div>

      <button
        onClick={() => navigate('setup')}
        className='mt-3 w-full h-14 bg-gray-600 text-white text-lg font-bold rounded-xl active:scale-95 transition-all duration-100 active:bg-gray-700'
      >
        QUAY LẠI
      </button>
    </ScreenLayout>
  );
}
