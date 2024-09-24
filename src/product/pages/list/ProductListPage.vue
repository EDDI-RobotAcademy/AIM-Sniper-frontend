<template>
    <div class="background-image">
        <v-container>
            <v-row class="justify-center align-center">
                <v-col cols="3">
                    <v-select 
                        v-model="selectedCategory" 
                        :items="categories" 
                        label="카테고리 선택"
                        class="category-select" 
                        outlined
                    ></v-select>
                </v-col>
                <v-col cols="6">
                    <v-text-field
                        v-model="searchQuery"
                        label="검색"
                        prepend-inner-icon="mdi-magnify"
                        clearable
                        class="search-input"
                        outlined
                    ></v-text-field>
                </v-col>
                <v-col v-if="isAdmin" cols="auto" class="text-right">
                    <v-btn
                        :to="{ name: 'ProductRegisterPage' }"
                        class="register-btn"
                        height="40"
                        outlined
                    >
                        상품 등록
                    </v-btn>
                </v-col>
            </v-row>

            <h1 class="section-title" @click="toggleVisibility('allProductsVisible')">
                전체 상품 <v-icon small>mdi-chevron-down</v-icon>
            </h1>

            <v-row v-if="allProductsVisible && paginatedProducts.length > 0">
                <v-col v-for="(product, index) in paginatedProducts" :key="index" cols="12" sm="6" md="4" lg="3">
                    <v-card
                        class="product-card"
                        @click="goToProductReadPage(product.productId)"
                        hover
                        outlined
                    >
                        <v-img :src="getImageUrl(product.productTitleImage)" aspect-ratio="1.5">
                            <template v-slot:placeholder>
                                <v-row class="fill-height ma-0" align="center" justify="center">
                                    <v-progress-circular indeterminate color="grey lighten-5" />
                                </v-row>
                            </template>
                        </v-img>
                        <v-card-title class="product-title">{{ product.productName }}</v-card-title>
                        <v-card-subtitle class="product-price">{{ product.productPrice }}원</v-card-subtitle>
                    </v-card>
                </v-col>
            </v-row>

            <v-row v-else-if="allProductsVisible">
                <v-col cols="12" class="text-center">
                    <v-alert type="info">등록된 전체 보고서가 없습니다!</v-alert>
                </v-col>
            </v-row>

            <v-row v-if="filteredProducts.length > itemsPerPage">
                <v-col cols="12" class="text-center">
                    <v-pagination
                        v-model="currentPage"
                        :length="Math.ceil(filteredProducts.length / itemsPerPage)"
                        @input="changePage"
                    />
                </v-col>
            </v-row>
        </v-container>
    </div>
</template>

<script>
import { mapActions, mapState } from 'vuex'
const authenticationModule = 'authenticationModule'

export default {
    computed: {
        ...mapState('productModule', ['products']),
        ...mapState(authenticationModule, ["isAdmin"]),
        paginatedProducts() {
            const startIndex = (this.currentPage - 1) * this.itemsPerPage;
            return this.filteredProducts.slice(startIndex, startIndex + this.itemsPerPage);
        },
        filteredProducts() {
            let products = this.products;

            if (this.selectedCategory !== '전체') {
                products = products.filter(product => product.productCategory === this.selectedCategory);
            }

            if (this.searchQuery) {
                const query = this.searchQuery.toLowerCase();
                products = products.filter(product => product.productName.toLowerCase().includes(query));
            }
            return products;
        }
    },
    data() {
        return {
            categories: ['전체','IT',"플랫폼","은행"],
            selectedCategory: '전체',
            searchQuery: '',
            currentPage: 1,
            itemsPerPage: 8,
            allProductsVisible: true,
        };
    },
    methods: {
        ...mapActions('productModule', ['requestProductListToDjango']),
        goToProductReadPage(productId) {
            this.$router.push({ name: 'ProductReadPage', params: { productId } });
        },
        toggleVisibility(section) {
            this[section] = !this[section];
        },
        changePage(page) {
            this.currentPage = page;
        },
        // getImageUrl(imageName) {
        //     return require(`@/assets/images/uploadImages/${imageName}`);
        // },
    },
    mounted() {
        this.requestProductListToDjango();
    }
};
</script>

<style>
.section-title {
    color: #0b0b0b;
    font-family: 'Roboto', sans-serif;
    font-weight: bold;
    font-size: 24px;
    margin-top: 40px;
}

.register-btn {
    background-color: #f5f5f5;
    color: #333;
    border: 1px solid #ccc;
    box-shadow: none;
    text-transform: none;
}

.product-card {
    transition: transform 0.2s ease-in-out;
}

.product-card:hover {
    transform: scale(1.05);
}

.product-title {
    font-size: 18px;
    font-weight: bold;
}

.product-price {
    color: #ff5252;
    font-weight: 600;
}

.product-image {
    border-bottom: 1px solid #f5f5f5;
}

.search-input .v-text-field__control {
    border-radius: 30px;
}

.category-select .v-input__control {
    border-radius: 30px;
    background-color: #fff;
}
</style>
