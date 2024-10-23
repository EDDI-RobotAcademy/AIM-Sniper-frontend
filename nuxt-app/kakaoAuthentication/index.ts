import { defineNuxtModule } from "@nuxt/kit";
import { resolve } from "path";

export default defineNuxtModule({
	meta: {
		name: "kakaoAuthentication",
		configKey: "kakaoAuthentication",
	},

	setup(moduleOptions, nuxt) {
		const themeDir = resolve(__dirname, "..");

		nuxt.hook("pages:extend", (pages) => {
			pages.push({
				name: "KakaoRedirection",
				path: '/kakao_oauth/kakao-access-token',
                file: resolve(themeDir, "kakoAuthentication/pages/KakaoRedirection.vue"),
			});
		});

		nuxt.hook("imports:dirs", (dirs) => {
			dirs.push(resolve(__dirname, "store"));
		});
	},
});