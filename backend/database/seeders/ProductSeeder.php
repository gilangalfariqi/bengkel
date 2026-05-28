<?php

namespace Database\Seeders;

use App\Models\Product;
use App\Models\ProductImage;
use App\Models\Category;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class ProductSeeder extends Seeder
{
    public function run(): void
    {
        // Curated small motorcycle parts and accessories with reliable remote images
        $productsData = [
            // Category: Mesin (Slug: mesin)
            [
                'category_slug' => 'mesin',
                'name' => 'Busi NGK Iridium IX CPR9EAIX-9',
                'brand' => 'NGK',
                'price' => 125000,
                'discount_price' => 110000,
                'stock' => 150,
                'weight' => 80,
                'description' => 'Busi NGK Iridium IX dengan elektroda pusat logam mulia iridium menawarkan ketahanan tinggi dan pengapian yang konsisten.',
                'specifications' => json_encode(['Tipe' => 'Iridium IX', 'Ukuran Ulir' => '10mm', 'Kompatibilitas' => 'Beat, Vario, NMAX, Aerox']),
                'images' => [
                    'https://images.unsplash.com/photo-1647462479261-26ec25d30d1d?w=800',
                    'https://images.unsplash.com/photo-1486006920555-c77dce18193b?w=800'
                ]
            ],
            [
                'category_slug' => 'mesin',
                'name' => 'Roller CVT TDR Racing 11 Gram Beat / Mio',
                'brand' => 'TDR',
                'price' => 95000,
                'discount_price' => null,
                'stock' => 80,
                'weight' => 100,
                'description' => 'Roller CVT presisi tinggi dengan material teflon tahan panas, meningkatkan respon akselerasi motor matic harian.',
                'specifications' => json_encode(['Berat' => '11 Gram', 'Jumlah' => '6 Pcs', 'Material' => 'Teflon Premium']),
                'images' => [
                    'https://images.unsplash.com/photo-1486006920555-c77dce18193b?w=800'
                ]
            ],
            [
                'category_slug' => 'mesin',
                'name' => 'Paking Cylinder Head Honda Genuine Parts Vario 150',
                'brand' => 'AHM',
                'price' => 35000,
                'discount_price' => 30000,
                'stock' => 200,
                'weight' => 20,
                'description' => 'Paking kepala silinder original Honda, presisi tinggi untuk mencegah kebocoran kompresi dan rembesan oli mesin.',
                'specifications' => json_encode(['Tipe' => 'Gasket Cylinder Head', 'Bahan' => 'Baja Tipis', 'Kompatibilitas' => 'Vario 125 / 150']),
                'images' => [
                    'https://images.unsplash.com/photo-1508962914676-134849a727f0?w=800'
                ]
            ],
            [
                'category_slug' => 'mesin',
                'name' => 'Filter Udara Yamaha Genuine Parts NMAX',
                'brand' => 'YGP',
                'price' => 75000,
                'discount_price' => 65000,
                'stock' => 120,
                'weight' => 300,
                'description' => 'Saringan udara original Yamaha tipe viscous paper (kertas basah) untuk menjamin pasokan udara bersih optimal ke ruang bakar.',
                'specifications' => json_encode(['Tipe' => 'Kertas Basah (Viscous)', 'Kompatibilitas' => 'Yamaha NMAX 2015-2019']),
                'images' => [
                    'https://images.unsplash.com/photo-1534224039826-c7a0eda0e6b3?w=800'
                ]
            ],
            
            // Category: Body Part (Slug: body-part)
            [
                'category_slug' => 'body-part',
                'name' => 'Baut Body Probolt L Stainless M6x15 (10 Pcs)',
                'brand' => 'Probolt',
                'price' => 85000,
                'discount_price' => 75000,
                'stock' => 100,
                'weight' => 50,
                'description' => 'Set baut body stainless steel anti karat dengan kepala model L kunci 4. Presisi dan memberikan tampilan elegan pada motor.',
                'specifications' => json_encode(['Ukuran' => 'M6 x 15mm', 'Bahan' => 'Stainless Steel', 'Isi' => '10 Pcs']),
                'images' => [
                    'https://images.unsplash.com/photo-1611080626919-7cf5a9dbab5b?w=800'
                ]
            ],
            [
                'category_slug' => 'body-part',
                'name' => 'Kabel Kopling Suzuki Satria FU Original',
                'brand' => 'SGP',
                'price' => 65000,
                'discount_price' => null,
                'stock' => 40,
                'weight' => 150,
                'description' => 'Kabel kopling original Suzuki untuk tarikan kopling yang enteng dan presisi, awet tidak mudah putus atau seret.',
                'specifications' => json_encode(['Panjang' => '95cm', 'Kompatibilitas' => 'Satria FU 150 Karburator', 'Bahan' => 'Kawat Baja Karbon']),
                'images' => [
                    'https://images.unsplash.com/photo-1544725176-7c40e5a71c5e?w=800'
                ]
            ],
            [
                'category_slug' => 'body-part',
                'name' => 'Kampas Rem Depan Daytona Ultra Force Non-Asbes',
                'brand' => 'Daytona',
                'price' => 95000,
                'discount_price' => 85000,
                'stock' => 90,
                'weight' => 120,
                'description' => 'Kampas rem non-asbestos dengan daya cengkeram kuat, tahan panas tinggi, dan ramah terhadap piringan cakram motor.',
                'specifications' => json_encode(['Material' => 'Lapisan Non-Asbes', 'Tipe' => 'Ultra Force', 'Sertifikasi' => 'JIS Standard']),
                'images' => [
                    'https://images.unsplash.com/photo-1502877338535-766e1452684a?w=800'
                ]
            ],

            // Category: Kelistrikan (Slug: kelistrikan)
            [
                'category_slug' => 'kelistrikan',
                'name' => 'Sekring Tancap Mini Fuse DX Set (15 Pcs)',
                'brand' => 'DX',
                'price' => 20000,
                'discount_price' => 15000,
                'stock' => 250,
                'weight' => 20,
                'description' => 'Paket sekring tancap ukuran mini untuk berbagai kebutuhan sistem kelistrikan motor, berfungsi mencegah kerusakan akibat korsleting.',
                'specifications' => json_encode(['Kapasitas' => '5A, 10A, 15A, 20A', 'Isi' => '15 Pcs', 'Material' => 'Seng Paduan & Plastik']),
                'images' => [
                    'https://images.unsplash.com/photo-1558089687-f282ffcbd1d5?w=800'
                ]
            ],
            [
                'category_slug' => 'kelistrikan',
                'name' => 'Bohlam Lampu Sein LED T10 Ayoto Super Bright',
                'brand' => 'Ayoto',
                'price' => 35000,
                'discount_price' => 30000,
                'stock' => 180,
                'weight' => 30,
                'description' => 'Lampu LED soket T10 super terang dan hemat energi. Sangat cocok untuk lampu sein, senja, maupun lampu speedometer.',
                'specifications' => json_encode(['Tipe' => 'LED T10', 'Daya' => '2 Watt', 'Warna' => 'Amber (Kuning Lampu Sein)']),
                'images' => [
                    'https://images.unsplash.com/photo-1518770660439-4636190af475?w=800'
                ]
            ],
            [
                'category_slug' => 'kelistrikan',
                'name' => 'Flashing Relay Sein Setel CR7 12V',
                'brand' => 'CR7',
                'price' => 15000,
                'discount_price' => null,
                'stock' => 110,
                'weight' => 40,
                'description' => 'Flasher sein elektrik yang bisa diatur kecepatan kedipannya. Sangat cocok untuk modifikasi lampu sein tipe LED.',
                'specifications' => json_encode(['Tegangan' => '12 Volt', 'Kecepatan' => '60-120 kedip/menit', 'Kompatibilitas' => 'Universal']),
                'images' => [
                    'https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?w=800'
                ]
            ],

            // Category: Ban & Velg (Slug: ban-velg)
            [
                'category_slug' => 'ban-velg',
                'name' => 'Pentil Ban Tubeless Bengkok L Aluminium CNC Scarlet',
                'brand' => 'Scarlet',
                'price' => 45000,
                'discount_price' => 40000,
                'stock' => 85,
                'weight' => 40,
                'description' => 'Pentil tubeless bengkok 90 derajat berbahan aluminium CNC. Mempermudah pengisian angin pada roda matic berdiameter kecil.',
                'specifications' => json_encode(['Bahan' => 'Aluminium CNC', 'Desain' => 'Bengkok L 90 Derajat', 'Kelengkapan' => '2 Pcs (Sepasang)']),
                'images' => [
                    'https://images.unsplash.com/photo-1578844251758-2f71da64c96f?w=800'
                ]
            ],
            [
                'category_slug' => 'ban-velg',
                'name' => 'Tutup Pentil Ban Model Mahkota RCB Aluminium',
                'brand' => 'RCB',
                'price' => 25000,
                'discount_price' => null,
                'stock' => 160,
                'weight' => 10,
                'description' => 'Tutup pentil ban variasi dengan desain mahkota yang tangguh. Terbuat dari aluminium CNC anodized tahan pudar.',
                'specifications' => json_encode(['Bahan' => 'Aluminium CNC', 'Desain' => 'Mahkota RCB', 'Isi' => '2 Pcs']),
                'images' => [
                    'https://images.unsplash.com/photo-1580273916550-e323be2ae537?w=800'
                ]
            ],

            // Category: Aksesoris (Slug: aksesoris)
            [
                'category_slug' => 'aksesoris',
                'name' => 'Gantungan Kunci Kulit Sintetis RCB Sporty',
                'brand' => 'RCB',
                'price' => 30000,
                'discount_price' => 25000,
                'stock' => 130,
                'weight' => 15,
                'description' => 'Gantungan kunci motor eksklusif dengan paduan bahan kulit sintetis bertekstur carbon dan pengait logam kokoh.',
                'specifications' => json_encode(['Bahan' => 'Kulit Sintetis & Stainless', 'Panjang' => '10cm', 'Logo' => 'Emboss RCB']),
                'images' => [
                    'https://images.unsplash.com/photo-1599819811279-d5ad9cccf838?w=800'
                ]
            ],
            [
                'category_slug' => 'aksesoris',
                'name' => 'Stiker Reflektif List Velg Motor RCB 14 Inch',
                'brand' => 'RCB',
                'price' => 40000,
                'discount_price' => null,
                'stock' => 70,
                'weight' => 30,
                'description' => 'Stiker list velg reflektif presisi yang memantulkan cahaya di malam hari, menambah kemanan berkendara di tempat minim cahaya.',
                'specifications' => json_encode(['Ukuran' => 'Velg 14 Inch', 'Lebar' => '8mm', 'Warna' => 'Merah Reflektif']),
                'images' => [
                    'https://images.unsplash.com/photo-1568772585407-9361f9bf3a87?w=800'
                ]
            ],

            // Category: Oli & Cairan (Slug: oli-cairan)
            [
                'category_slug' => 'oli-cairan',
                'name' => 'Oli Samping Motul 510 2T Technosynthese 1L',
                'brand' => 'Motul',
                'price' => 145000,
                'discount_price' => 135000,
                'stock' => 90,
                'weight' => 1000,
                'description' => 'Oli samping motor 2-tak berkualitas tinggi dengan formula anti-smoke, melindungi piston dari keausan ekstrim.',
                'specifications' => json_encode(['Tipe' => 'Semi-Sintetik (Technosynthese)', 'Volume' => '1 Liter', 'Sertifikasi' => 'JASO FD / API TC']),
                'images' => [
                    'https://images.unsplash.com/photo-1554995207-c18c203602cb?w=800'
                ]
            ],
            [
                'category_slug' => 'oli-cairan',
                'name' => 'Minyak Rem Brembo LCF 600 Plus DOT 4 (500ml)',
                'brand' => 'Brembo',
                'price' => 380000,
                'discount_price' => null,
                'stock' => 35,
                'weight' => 600,
                'description' => 'Minyak rem spesifikasi balap dengan titik didih kering sangat tinggi untuk kestabilan pengereman optimal di sirkuit maupun harian.',
                'specifications' => json_encode(['Tipe' => 'DOT 4 Balap', 'Titik Didih' => '316 Derajat C', 'Volume' => '500ml']),
                'images' => [
                    'https://images.unsplash.com/photo-1620641788421-7a1c342ea42e?w=800'
                ]
            ]
        ];

        // Clean out existing products and images to ensure fresh state
        ProductImage::query()->delete();
        Product::query()->delete();

        foreach ($productsData as $data) {
            $category = Category::where('slug', $data['category_slug'])->first();
            if (!$category) {
                continue;
            }

            $name = $data['name'];
            $slug = Str::slug($name) . '-' . Str::random(5);

            $product = Product::create([
                'category_id' => $category->id,
                'name' => $name,
                'slug' => $slug,
                'description' => $data['description'],
                'price' => $data['price'],
                'discount_price' => $data['discount_price'],
                'stock' => $data['stock'],
                'weight' => $data['weight'],
                'brand' => $data['brand'],
                'specifications' => $data['specifications'],
                'is_active' => true,
            ]);

            foreach ($data['images'] as $idx => $remoteUrl) {
                ProductImage::create([
                    'product_id' => $product->id,
                    'image_path' => $remoteUrl,
                    'is_primary' => ($idx === 0),
                ]);
            }
        }
    }
}
