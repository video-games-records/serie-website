<template>
  <div class="container mx-auto px-6 py-8">
    <div v-if="pending" class="text-center py-8">
      <p>Chargement des groupes...</p>
    </div>
    
    <div v-else-if="error" class="text-center py-8 text-red-500">
      <p>Erreur lors du chargement des groupes: {{ error }}</p>
    </div>
    
    <div v-else>
      <!-- Breadcrumb -->
      <div class="mb-8">
        <nav class="flex items-center gap-2 text-sm">
          <NuxtLink to="/" class="hover:text-accent">Accueil</NuxtLink>
          <span>›</span>
          <NuxtLink :to="`/games/${route.params.slug}`" class="hover:text-accent">
            {{ game?.libGame || 'Jeu' }}
          </NuxtLink>
          <span>›</span>
          <span class="text-accent">Groupes</span>
        </nav>
      </div>
      
      <!-- Header -->
      <div class="mb-8">
        <h1 class="text-3xl font-bold text-accent mb-4">
          Groupes - {{ game?.libGame || 'Jeu' }}
        </h1>
        <p class="text-lg opacity-80">
          Explorez tous les groupes de ce jeu
        </p>
      </div>
      
      <!-- Groups Table -->
      <div v-if="groups && groups.length > 0" class="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <!-- Table Header -->
        <div class="grid grid-cols-4 gap-4 p-4 bg-gray-50 border-b border-gray-200 font-medium text-gray-700 text-sm">
          <div>Group</div>
          <div class="text-center">Records</div>
          <div class="text-center">Players</div>
          <div class="text-center">Scores</div>
        </div>
        
        <!-- Table Body -->
        <div>
          <NuxtLink 
            v-for="group in groups" 
            :key="group.id"
            :to="`/game/${route.params.id}/group/${group.id}`"
            class="grid grid-cols-4 gap-4 p-4 border-b border-gray-100 hover:bg-gray-50 transition-colors cursor-pointer items-center"
          >
            <!-- Group Name -->
            <div class="flex items-center">
              <div class="w-6 h-6 bg-yellow-100 rounded mr-3 flex items-center justify-center">
                <svg class="w-4 h-4 text-yellow-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M2 6a2 2 0 012-2h5l2 2h5a2 2 0 012 2v6a2 2 0 01-2 2H4a2 2 0 01-2-2V6z" clip-rule="evenodd" />
                </svg>
              </div>
              <span>{{ group.name || group.libGroup }}</span>
            </div>
            
            <!-- Records -->
            <div class="text-center">
              <span class="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-orange-100 text-orange-800">
                {{ group.nbChart || 25 }}
              </span>
            </div>
            
            <!-- Players -->
            <div class="text-center">
              <span class="inline-flex items-center opacity-80">
                <svg class="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM5 8a2 2 0 012-2h6a2 2 0 012 2v6a2 2 0 01-2 2H7a2 2 0 01-2-2V8z" />
                </svg>
                {{ group.nbPlayer || 0 }}
              </span>
            </div>
            
            <!-- Scores -->
            <div class="text-center flex items-center justify-between">
              <span class="font-medium">{{ group.nbPost || 0 }}</span>
              <svg class="w-5 h-5 opacity-60" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clip-rule="evenodd" />
              </svg>
            </div>
          </NuxtLink>
        </div>
      </div>
      
      <div v-else class="card p-8 text-center">
        <h3 class="text-xl font-semibold mb-4">Aucun groupe trouvé</h3>
        <p class="opacity-80">Ce jeu ne contient pas encore de groupes.</p>
        <NuxtLink :to="`/games/${route.params.slug}`" class="btn-primary mt-4 inline-block">
          Retour au jeu
        </NuxtLink>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Group, GroupsApiResponse } from '@types/group'
import type { Game } from '@types/game'

const route = useRoute()
const config = useRuntimeConfig()

const gameId = route.params.id as string

// Get game info
const { data: game, pending: gamePending, error: gameError } = await $fetch<Game>(`${config.public.apiBaseUrl}/games/${gameId}`)

// Get groups for this game
const { data: groupsResponse, pending, error } = await $fetch<GroupsApiResponse>(`${config.public.apiBaseUrl}/games/${gameId}/groups`)

const groups = computed(() => groupsResponse.value?.["hydra:member"] || [])

// SEO
useHead({
  title: `Groupes - ${game.value?.libGame || 'Jeu'} - Records`
})
</script>