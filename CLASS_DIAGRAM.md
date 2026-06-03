# TripBuddy Class Diagram

> Database hien tai dung Firestore collection `trips-ai`. Moi document trong collection nay la mot `ChuyenDi`; cac phan nhu lich trinh, khach san, booking, dia diem yeu thich... dang la object/array long trong document.

## Mermaid

```mermaid
classDiagram
direction LR

class NguoiDung {
  +String maNguoiDung
  +String hoTen
  +String email
  +String anhDaiDien
  +dangNhap()
  +dangXuat()
  +taoChuyenDi()
  +xemDanhSachChuyenDi()
}

class QuanTriVien {
  +String maAdmin
  +String username
  +String matKhau
  +String vaiTro
  +dangNhap()
  +xemDashboard()
  +duyetDatPhong()
  +duyetDatXe()
}

class ChuyenDi {
  +String maChuyenDi
  +String userEmail
  +String shareId
  +Boolean shareEnabled
  +Date sharedAt
  +String tripReview
  +Date tripCompletedAt
  +taoChuyenDi()
  +xemChiTiet()
  +capNhatTienDo()
  +chiaSeChuyenDi()
  +xuatPDF()
}

class LuaChonChuyenDi {
  +String diemDen
  +int soNgay
  +String doiTuongDi
  +String nganSach
}

class KeHoachDuLich {
  +String diaDiem
  +String ghiChuChuyenDi
}

class LichTrinh {
  +int ngay
  +String chuDe
  +xemHoatDong()
}

class DiaDiemKhamPha {
  +String maDiaDiem
  +String tenDiaDiem
  +String moTa
  +String hinhAnh
  +String giaVe
  +String thoiGian
  +String thoiGianDiChuyen
  +ToaDo toaDo
  +danhDauYeuThich()
  +danhDauDaThamQuan()
}

class KhachSan {
  +String tenKhachSan
  +String diaChi
  +String khoangGia
  +String hinhAnh
  +double danhGia
  +String moTa
  +ToaDo toaDo
  +xemBanDo()
  +datPhong()
}

class DatPhongKhachSan {
  +String maDatPhong
  +String tenKhachSan
  +String diaChiKhachSan
  +String loaiPhong
  +String tenLoaiPhong
  +int soKhach
  +int soDem
  +Date ngayNhanPhong
  +Date ngayTraPhong
  +double giaMoiDem
  +double tongTien
  +String trangThaiThanhToan
  +String phuongThucThanhToan
  +String trangThai
  +Date ngayDat
  +Date ngayDuyet
  +String nguoiDuyet
  +guiYeuCauDatPhong()
  +capNhatTrangThai()
}

class DatXe {
  +String maDatXe
  +String diemDon
  +String diemTra
  +Date thoiGianDon
  +String loaiXe
  +String nhaCungCap
  +String thoiGianCho
  +double danhGiaNhaCungCap
  +double khoangCachKm
  +double giaDuKien
  +String trangThaiThanhToan
  +String trangThai
  +Date ngayTao
  +Date ngayDuyet
  +String nguoiDuyet
  +datXe()
  +capNhatTrangThai()
}

class DiaDiemYeuThich {
  +String key
  +String tenHoatDong
  +String moTa
  +String hinhAnh
  +String giaVe
  +String thoiGian
  +int ngay
  +String chuDe
  +String diemDen
  +String maChuyenDi
  +String tenChuyenDi
  +Date ngayLuu
  +boYeuThich()
}

class DiaDiemDaThamQuan {
  +String key
  +String tenHoatDong
  +int ngay
  +Date daThamQuanLuc
  +boDanhDau()
}

class KeHoachNganSach {
  +double tongNganSach
  +double tongKhachSan
  +double tongDiChuyen
  +Date capNhatLuc
  +tinhTongDaLenKeHoach()
  +tinhConLai()
  +luuNganSach()
}

class HangMucNganSach {
  +String key
  +String tenHangMuc
  +double soTien
}

class GoiYAnUong {
  +String maGoiY
  +String buaAn
  +String tenQuan
  +String loaiAmThuc
  +String khuVuc
  +String monNenThu
  +double danhGia
  +String mucGia
  +String ghiChu
  +String mapUrl
  +xemBanDo()
}

class ToaDo {
  +double lat
  +double lng
}

NguoiDung "1" --> "0..*" ChuyenDi : tao/so huu
QuanTriVien "1" --> "0..*" DatPhongKhachSan : duyet
QuanTriVien "1" --> "0..*" DatXe : duyet

ChuyenDi "1" *-- "1" LuaChonChuyenDi : userSelection
ChuyenDi "1" *-- "1" KeHoachDuLich : tripData.travelPlan
ChuyenDi "1" *-- "0..1" DatPhongKhachSan : bookedHotel
ChuyenDi "1" *-- "0..*" DatXe : transportBookings
ChuyenDi "1" *-- "0..*" DiaDiemYeuThich : favoritePlaces
ChuyenDi "1" *-- "0..*" DiaDiemDaThamQuan : visitedPlaces
ChuyenDi "1" *-- "0..1" KeHoachNganSach : budgetPlan
ChuyenDi "1" ..> GoiYAnUong : goiYTheoDiemDen

KeHoachDuLich "1" *-- "0..*" KhachSan : hotelsOptions
KeHoachDuLich "1" *-- "1..*" LichTrinh : itinerary
LichTrinh "1" *-- "1..*" DiaDiemKhamPha : activities
KeHoachNganSach "1" *-- "1..*" HangMucNganSach : categories

KhachSan "1" o-- "0..1" ToaDo
DiaDiemKhamPha "1" o-- "0..1" ToaDo
DatPhongKhachSan "1" o-- "0..1" ToaDo
DatXe "1" o-- "0..1" ToaDo : diemDon
DatXe "1" o-- "0..1" ToaDo : diemTra

DatPhongKhachSan ..> KhachSan : datTu
DiaDiemYeuThich ..> DiaDiemKhamPha : luuTu
DiaDiemDaThamQuan ..> DiaDiemKhamPha : danhDauTu
DatXe ..> DatPhongKhachSan : diemTraLaKhachSan
```

## Mapping voi Firestore

```text
trips-ai/{tripId}
  id
  userEmail
  userSelection
    destination
    noOfDays
    traveler
    budget
  tripData.travelPlan
    location/tripNote
    hotelsOptions[]
    itinerary[]
      dayNumber/theme
      activities[]
  bookedHotel
  transportBookings[]
  favoritePlaces{activityKey}
  visitedPlaces{activityKey}
  budgetPlan
    totalBudget/categories[]/hotelTotal/transportTotal/updatedAt
  tripReview
  tripCompletedAt
  shareId/shareEnabled/sharedAt
```

## Ghi chu thiet ke

- `NguoiDung` khong phai collection rieng trong Firestore hien tai; app lay user tu Google OAuth va luu `userEmail` vao `ChuyenDi`.
- `QuanTriVien` hien dang la tai khoan tu bien moi truong/localStorage, khong phai collection rieng.
- `GoiYAnUong` hien dang duoc tinh tu component theo `destination` va `budget`; neu muon luu vao database thi co the them field `foodSuggestions[]` trong document trip.
- `DatPhongKhachSan`, `DatXe`, `DiaDiemYeuThich`, `DiaDiemDaThamQuan`, `KeHoachNganSach` la du lieu con cua `ChuyenDi`, nen trong UML dung composition `*--`.
