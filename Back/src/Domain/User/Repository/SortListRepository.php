<?php

namespace Src\Domain\User\Repository;


// 1 = tri croissant
// 2 = tri decroissant
// 0 = pas de tri

class SortListRepository
{
    public function sort($users, $instruc) {
      $byAge = $instruc->age;
      $byScore = $instruc->score;
      $byTag = $instruc->tsyn;
      $byDst = $instruc->dst;

      usort($users, function($a, $b) use($byAge, $byScore, $byTag, $byDst) {
          if ($byDst == 1)
            $retval = $a['dst'] <=> $b['dst'];
          if ($byDst == 2)
            $retval = $b['dst'] <=> $a['dst'];
          if ($retval == 0) {  
            if ($byTag == 1)
              $retval = $a['sameTag'] <=> $b['sameTag'];
            if ($byTag == 2)
              $retval = $b['sameTag'] <=> $a['sameTag'];
            if ($retval == 0) {
              if ($byAge == 1)
                $retval = $a['age'] <=> $b['age'];
              if ($byAge == 2)
                $retval = $b['age'] <=> $a['age'];
              if ($retval == 0) {
                if ($byScore == 1)
                  $retval = $a['score'] <=> $b['score'];
                if ($byScore == 2)
                  $retval = $b['score'] <=> $a['score'];
              }
            }
          }  
          return $retval;
      });
      
      return $users;
    }    
}