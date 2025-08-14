<template>
    <div style="padding: 20px; width: 100%; height: 73%">
        <breadcrumb-component :breadcrumb-path="[{ title: '이력' }]" breadcrumb-title=" 물 요청 이력"
            :is-calendar="true"></breadcrumb-component>

        <div style="margin: 20px 0 0 0; font-family: 'NotoSansKR-Medium'">
            <div>요청이력</div>
        </div>
    </div>
</template>

<script>
import BreadcrumbComponent from '../common/BreadcrumbComponent.vue';

export default {
    name: 'CalendarRueqest',
    components: {
        BreadcrumbComponent
    }
}
</script>