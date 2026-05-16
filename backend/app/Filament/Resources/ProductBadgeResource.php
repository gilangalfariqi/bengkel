<?php

namespace App\Filament\Resources;

use App\Filament\Resources\ProductBadgeResource\Pages;
use App\Models\ProductBadge;
use App\Models\Product;
use Filament\Forms;
use Filament\Schemas\Schema;
use Filament\Schemas\Components\Section;
use Filament\Resources\Resource;
use Filament\Tables;
use Filament\Tables\Table;

class ProductBadgeResource extends Resource
{
    protected static ?string $model = ProductBadge::class;

    protected static string | \BackedEnum | null $navigationIcon = 'heroicon-o-tag';

    protected static ?string $navigationLabel = 'Product Badges';

    public static function form(Schema $schema): Schema
    {
        return $schema->schema([
            Section::make('Badge Details')->schema([
                Forms\Components\Select::make('product_id')
                    ->label('Product')
                    ->relationship('product', 'name')
                    ->searchable()
                    ->required(),

                Forms\Components\TextInput::make('label')
                    ->label('Badge Label')
                    ->placeholder('e.g. Promo, Best Seller, New')
                    ->required()
                    ->maxLength(50),

                Forms\Components\ColorPicker::make('color')
                    ->label('Badge Color')
                    ->default('#E11D48'),

                Forms\Components\Toggle::make('is_active')
                    ->label('Active')
                    ->default(true),
            ])->columns(2),

            Section::make('Active Period (Optional)')->schema([
                Forms\Components\DateTimePicker::make('starts_at')
                    ->label('Start Date')
                    ->nullable(),

                Forms\Components\DateTimePicker::make('ends_at')
                    ->label('End Date')
                    ->nullable()
                    ->after('starts_at'),
            ])->columns(2),
        ]);
    }

    public static function table(Table $table): Table
    {
        return $table
            ->columns([
                Tables\Columns\TextColumn::make('product.name')
                    ->label('Product')
                    ->searchable()
                    ->sortable(),

                Tables\Columns\TextColumn::make('label')
                    ->badge()
                    ->color(fn (ProductBadge $record): string => match ($record->label) {
                        'Best Seller' => 'warning',
                        'New'         => 'success',
                        default       => 'danger',
                    }),

                Tables\Columns\ColorColumn::make('color')
                    ->label('Color'),

                Tables\Columns\IconColumn::make('is_active')
                    ->boolean()
                    ->label('Active'),

                Tables\Columns\TextColumn::make('starts_at')
                    ->dateTime('d M Y H:i')
                    ->label('Starts')
                    ->placeholder('—'),

                Tables\Columns\TextColumn::make('ends_at')
                    ->dateTime('d M Y H:i')
                    ->label('Ends')
                    ->placeholder('—'),

                Tables\Columns\TextColumn::make('created_at')
                    ->dateTime()
                    ->sortable()
                    ->toggleable(isToggledHiddenByDefault: true),
            ])
            ->filters([
                Tables\Filters\SelectFilter::make('label')
                    ->options([
                        'Promo'       => 'Promo',
                        'Best Seller' => 'Best Seller',
                        'New'         => 'New',
                    ]),
                Tables\Filters\TernaryFilter::make('is_active')
                    ->label('Active'),
            ])
            ->actions([
                \Filament\Actions\EditAction::make(),
                \Filament\Actions\DeleteAction::make(),
            ])
            ->bulkActions([
                \Filament\Actions\BulkActionGroup::make([
                    \Filament\Actions\DeleteBulkAction::make(),
                ]),
            ])
            ->defaultSort('created_at', 'desc');
    }

    public static function getPages(): array
    {
        return [
            'index'  => Pages\ListProductBadges::route('/'),
            'create' => Pages\CreateProductBadge::route('/create'),
            'edit'   => Pages\EditProductBadge::route('/{record}/edit'),
        ];
    }
}
