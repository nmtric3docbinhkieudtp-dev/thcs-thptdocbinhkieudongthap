export type AccountRole = 'member' | 'admin';

export type AuthorizedAccount = {
  stt: number;
  name: string;
  email: string;
  role: AccountRole;
};

export const DEFAULT_PASSWORD = 'Dbk@2026';

export const authorizedAccounts: AuthorizedAccount[] = [
  { stt: 1, name: 'Nguyễn Minh Trí', email: 'nmtri.c3docbinhkieu@dongthap.edu.vn', role: 'admin' },
  { stt: 2, name: 'Lê Thanh Cường', email: 'ltcuong.c3docbinhkieu@dongthap.edu.vn', role: 'admin' },
  { stt: 3, name: 'Trịnh Văn Sơn', email: 'trinhvanson.c3docbinhkieu@dongthap.edu.vn', role: 'member' },
  { stt: 4, name: 'Trần Văn Rỡ', email: 'tvro.c3docbinhkieu@dongthap.edu.vn', role: 'member' },
  { stt: 5, name: 'Nguyễn Thị Bé Trang', email: 'ntbtrang.c3docbinhkieu@dongthap.edu.vn', role: 'member' },
  { stt: 6, name: 'Trần Phước Hòa', email: 'tphoa.c3docbinhkieu@dongthap.edu.vn', role: 'member' },
  { stt: 7, name: 'Ngô Anh Tuấn', email: 'natuan.c3docbinhkieu@dongthap.edu.vn', role: 'member' },
  { stt: 8, name: 'Phạm Nguyễn Văn Trường', email: 'phamnguyenvantruong200920@gmail.com', role: 'member' },
  { stt: 9, name: 'Bùi Kim Huỳnh', email: 'nnmyhuynh1904@gmail.com', role: 'member' },
  { stt: 10, name: 'Phan Thị Ngọc Thơ', email: 'phanthingocthodbk@gmail.com', role: 'member' },
  { stt: 11, name: 'Trần Thị Kiều', email: 'kieuhoahoc@gmail.com', role: 'member' },
  { stt: 12, name: 'Phạm Long Phi', email: 'phamphi82@gmail.com', role: 'member' },
  { stt: 13, name: 'Phạm Biên Thùy', email: 'thuylydbk@gmail.com', role: 'member' },
  { stt: 14, name: 'Hồ Hoài Ngân', email: 'ngantheduc89@gmail.com', role: 'member' },
  { stt: 15, name: 'Nguyễn Kim Rạng', email: 'theducdbk@gmail.com', role: 'member' },
  { stt: 16, name: 'Trần Thị Ngọc Hiền', email: 'ttnhienly18@gmail.com', role: 'member' },
  { stt: 17, name: 'Tô Thị Lắm', email: 'lamthptdbk@gmail.com', role: 'member' },
  { stt: 18, name: 'Lê Thị Mỹ Ny', email: 'sangny250407@gmail.com', role: 'member' },
  { stt: 19, name: 'Hồ Văn Nhịnh', email: 'hovanthapmuoi@gmail.com', role: 'member' },
  { stt: 20, name: 'Trường Thị Mỹ Duyên', email: 'duyen1794@gmail.com', role: 'member' },
  { stt: 21, name: 'Nguyễn Văn Tới', email: 'nvantoi.dbk@gmail.com', role: 'member' },
  { stt: 22, name: 'Võ Thị Ngọc Hương', email: 'ngochuonglv2@gmail.com', role: 'member' },
  { stt: 23, name: 'Lê Cao Toàn', email: 'lecaotoan@gmail.com', role: 'member' },
  { stt: 24, name: 'Trần Văn Giang', email: 'tvgiang.dbk@gmail.com', role: 'member' },
  { stt: 25, name: 'Lê Văn Toàn', email: 'levantoan.le@gmail.com', role: 'member' },
  { stt: 26, name: 'Nguyễn Trung Hiếu', email: 'hieu.dbk@gmail.com', role: 'member' },
  { stt: 27, name: 'Võ Thị Hiền Thi', email: 'hienthidbk@gmail.com', role: 'member' },
  { stt: 28, name: 'Lê Thị Thu Diễm', email: 'diemhanphuc@gmail.com', role: 'member' },
  { stt: 29, name: 'Đào Thị Ngọc Liên', email: 'daolien999@gmail.com', role: 'member' },
  { stt: 30, name: 'Ngô Bảo Quốc', email: 'ngobaoquocthptdbk3081970@gmail.com', role: 'member' },
  { stt: 31, name: 'Nguyễn Thị Vân Anh', email: 'nguyenthivananh811@gmail.com', role: 'member' },
  { stt: 32, name: 'Trương Sơn Bền', email: 'sonben2000@gmail.com', role: 'member' },
  { stt: 33, name: 'Cao Văn Tùng', email: 'tungdbk@gmail.com', role: 'member' },
];

export function findAccountByEmail(email: string): AuthorizedAccount | undefined {
  const normalized = email.trim().toLowerCase();
  return authorizedAccounts.find((account) => account.email === normalized);
}
