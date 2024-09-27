<template>
  <v-card class="mx-auto my-12" max-width="800" v-if="resultForm">
    <v-card-title>
      <span class="headline">{{ resultForm.surveyTitle }}</span>
    </v-card-title>
    <v-card-subtitle>
      <span>{{ resultForm.surveyDescription }}</span>
    </v-card-subtitle>
    <v-card-text>
      <v-row v-for="(question, index) in resultForm.surveyQuestions" :key="index" class="mb-4">
        <v-col cols="12">
          <v-card outlined>
            <v-card-text>
              <h4>{{ index + 1 }}. {{ question.questionTitle }}</h4>
              <v-container v-if="question.questionType === 'text'">
                <span>{{ question.answer }}</span>
              </v-container>
              <v-container v-if="question.questionType === 'radio' || question.questionType === 'checkbox'">
              <div :ref="'chart_' + index" class="chart-container"></div>
                <span>{{ question.selection }}</span>
              </v-container>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
    </v-card-text>
  </v-card>
</template>

<script>
import { mapActions, mapState } from 'vuex';
import * as d3 from 'd3';
const surveyModule = 'surveyModule';

export default {
  props: {
    surveyId: {
      type: String,
      required: true,
    },
  },
  computed: {
    ...mapState(surveyModule, ['resultForm']),

  },
  mounted() {
    this.requestSurveyResultToDjango(this.surveyId);
    if (this.resultForm) {
      this.$nextTick(() => {
      this.resultForm.surveyQuestions.forEach((question, index) => {
        this.drawChart(question.selection, index);
      });
      window.addEventListener('resize', this.handleResize);
    });
    }
  },
  beforeUnmount() {
    window.removeEventListener('resize', this.handleResize);
  },
  methods: {
    ...mapActions(surveyModule, ['requestSurveyResultToDjango']),

    handleResize() {
      this.resultForm.surveyQuestions.forEach((question, index) => {
        this.drawChart(question.selection, index);
      });
    },

    drawChart(data, index) {
      const element = this.$refs['chart_' + index]; // 각 차트 컨테이너에 접근
      if (!element) return;

      const keys = Object.keys(data);  // key 값
      console.log('X 값 :', keys)
      const values = Object.values(data);  // value 값

      const margin = { top: 20, right: 30, bottom: 40, left: 40 };
      const width = element.clientWidth - margin.left - margin.right;
      const height = element.clientHeight - margin.top - margin.bottom;

      d3.select(element).selectAll('*').remove();

      const svg = d3.select(element)
        .append('svg')
        .attr('width', width + margin.left + margin.right)
        .attr('height', height + margin.top + margin.bottom)
        .append('g')
        .attr('transform', `translate(${margin.left},${margin.top})`);

      const x = d3.scaleBand()
        .domain(keys)
        .range([0, width])
        .padding(0.1);

      const y = d3.scaleLinear()
        .domain([0, d3.max(values)])
        .nice()
        .range([height, 0]);

      svg.append('g')
        .selectAll('rect')
        .data(values)
        .enter().append('rect')
        .attr('x', (d, i) => x(keys[i]))
        .attr('y', d => y(d))
        .attr('width', x.bandwidth())
        .attr('height', d => height - y(d))
        .attr('fill', 'steelblue');

      svg.append('g')
        .attr('class', 'x-axis')
        .attr('transform', `translate(0,${height})`)
        .call(d3.axisBottom(x));

      svg.append('g')
        .attr('class', 'y-axis')
        .call(d3.axisLeft(y));
    },
  },
};

</script>

<style scoped>
.headline {
  font-weight: bold;
}

.chart-container {
  width: 100%;
  height: 400px; /* 원하는 높이로 설정 */
}
</style>
