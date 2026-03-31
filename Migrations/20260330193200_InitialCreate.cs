using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

#pragma warning disable CA1814 // Prefer jagged arrays over multidimensional

namespace BuckeyeMarketplace.API.Migrations
{
    /// <inheritdoc />
    public partial class InitialCreate : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "Carts",
                columns: table => new
                {
                    Id = table.Column<int>(type: "INTEGER", nullable: false)
                        .Annotation("Sqlite:Autoincrement", true),
                    UserId = table.Column<string>(type: "TEXT", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "TEXT", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Carts", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "Products",
                columns: table => new
                {
                    Id = table.Column<int>(type: "INTEGER", nullable: false)
                        .Annotation("Sqlite:Autoincrement", true),
                    Title = table.Column<string>(type: "TEXT", nullable: false),
                    Description = table.Column<string>(type: "TEXT", nullable: false),
                    Price = table.Column<decimal>(type: "TEXT", nullable: false),
                    Category = table.Column<string>(type: "TEXT", nullable: false),
                    SellerName = table.Column<string>(type: "TEXT", nullable: false),
                    PostedDate = table.Column<DateTime>(type: "TEXT", nullable: false),
                    ImageUrl = table.Column<string>(type: "TEXT", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Products", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "CartItems",
                columns: table => new
                {
                    Id = table.Column<int>(type: "INTEGER", nullable: false)
                        .Annotation("Sqlite:Autoincrement", true),
                    CartId = table.Column<int>(type: "INTEGER", nullable: false),
                    ProductId = table.Column<int>(type: "INTEGER", nullable: false),
                    Quantity = table.Column<int>(type: "INTEGER", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_CartItems", x => x.Id);
                    table.ForeignKey(
                        name: "FK_CartItems_Carts_CartId",
                        column: x => x.CartId,
                        principalTable: "Carts",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_CartItems_Products_ProductId",
                        column: x => x.ProductId,
                        principalTable: "Products",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.InsertData(
                table: "Products",
                columns: new[] { "Id", "Category", "Description", "ImageUrl", "PostedDate", "Price", "SellerName", "Title" },
                values: new object[,]
                {
                    { 1, "Outfits", "Hand-dyed OSU scarlet and gray crewneck sweatshirt. Made-to-order, one of a kind. Unisex sizing, runs slightly oversized. Machine wash cold.", "/images/Sweatshirt.png", new DateTime(2025, 3, 1, 0, 0, 0, 0, DateTimeKind.Unspecified), 38.00m, "AlexDesigns", "Hand-Dyed Scarlet Tie-Dye Crewneck" },
                    { 2, "Outfits", "Thrifted denim jacket with hand-painted OSU Block O on the back using fabric paint. Size M. Truly one of a kind.", "/images/Jacket.png", new DateTime(2025, 3, 5, 0, 0, 0, 0, DateTimeKind.Unspecified), 55.00m, "AlexDesigns", "Upcycled Denim Jacket - Block O Back" },
                    { 3, "Accessories", "Hand-crocheted bucket hat in OSU scarlet. Stretchy and fits most head sizes. Perfect for game days or everyday wear.", "/images/Hat.png", new DateTime(2025, 3, 8, 0, 0, 0, 0, DateTimeKind.Unspecified), 22.00m, "YarnByJess", "Crocheted Scarlet Bucket Hat" },
                    { 4, "Tanks", "Original design screen-printed on a Bella Canvas tank. Unisex sizing S-XL. Soft, lightweight fabric.", "/images/Tank.png", new DateTime(2025, 3, 10, 0, 0, 0, 0, DateTimeKind.Unspecified), 18.00m, "AlexDesigns", "Custom Graphic Tank - Made in Columbus" },
                    { 5, "Stickers", "Set of 10 original hand-drawn vinyl stickers. Waterproof and laptop-safe.", "/images/Stickers.png", new DateTime(2025, 3, 16, 0, 0, 0, 0, DateTimeKind.Unspecified), 8.00m, "DoodlesByKayla", "OSU Campus Sticker Pack (10 Stickers)" },
                    { 6, "Blankets", "Arm-knitted chunky blanket in cream and gray. Super cozy for dorm nights or studying. Approx 40 x 50 inches.", "/images/blanket.jpeg", new DateTime(2025, 3, 18, 0, 0, 0, 0, DateTimeKind.Unspecified), 65.00m, "KnottyByNature", "Chunky Arm-Knit Throw Blanket" },
                    { 7, "Skirts", "Hand-sewn pleated mini skirt in heather gray. Elastic waistband, size S/M.", "/images/Skirt.png", new DateTime(2025, 3, 20, 0, 0, 0, 0, DateTimeKind.Unspecified), 28.00m, "MadisonCrafts", "Pleated Mini Skirt - OSU Gray" },
                    { 8, "Accessories", "Set of 3 handmade resin bookmarks with real pressed flowers. Glossy finish, gold ribbon tassel.", "/images/Bookmark.png", new DateTime(2025, 3, 22, 0, 0, 0, 0, DateTimeKind.Unspecified), 12.00m, "BloomByBri", "Pressed Flower Resin Bookmark Set" }
                });

            migrationBuilder.CreateIndex(
                name: "IX_CartItems_CartId",
                table: "CartItems",
                column: "CartId");

            migrationBuilder.CreateIndex(
                name: "IX_CartItems_ProductId",
                table: "CartItems",
                column: "ProductId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "CartItems");

            migrationBuilder.DropTable(
                name: "Carts");

            migrationBuilder.DropTable(
                name: "Products");
        }
    }
}
