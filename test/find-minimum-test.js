import test from 'ava';
import { FibonacciHeap } from '../';
import testHelper from '@tyriar/heap-tests/find-minimum-tests';

testHelper.run(test, FibonacciHeap);
